
import { useState, useEffect, useCallback } from 'react';
import * as XLSX from 'xlsx';
import { AllData, ProcessedData, ProcessedContact, Contract, Contact as RealContact, Screen, DashboardItem, ProcessedDashboardItem, ProcessedTopStory, ForecastItem, RawNaicsRow } from '../types';
import { DATA_URLS, FORECAST_URL, NAICS_URL, NVDB_URL } from '../constants';

export const useData = () => {
  const [data, setData] = useState<ProcessedData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // 1. Fetch standard JSON data
      const jsonPromises = Object.entries(DATA_URLS).map(([key, url]) =>
          fetch(url).then(res => {
            if (!res.ok) {
              throw new Error(`Failed to fetch ${key}: ${res.statusText}`);
            }
            return res.json();
          })
        );
      
      // 2. Fetch and parse Forecast XLSX
      const forecastPromise = fetch(FORECAST_URL)
        .then(res => {
             if(!res.ok) throw new Error("Failed to fetch forecasts");
             return res.arrayBuffer();
        })
        .then(buffer => {
            const workbook = XLSX.read(buffer, { type: 'array' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            return XLSX.utils.sheet_to_json<ForecastItem>(worksheet);
        })
        .catch(err => {
            console.warn("Forecast fetch failed", err);
            return [] as ForecastItem[];
        });

      // 3. Fetch and parse NAICS XLSX - Loading directly from local data folder
      const naicsPromise = fetch(NAICS_URL)
        .then(res => {
          if (!res.ok) throw new Error("Failed to fetch NAICS data from local source");
          return res.arrayBuffer();
        })
        .then(buffer => {
          const workbook = XLSX.read(buffer, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const rawJson = XLSX.utils.sheet_to_json<any>(sheet);
          
          let rows: RawNaicsRow[] = [];
          if (rawJson.length > 0) {
              const firstRow = rawJson[0];
              const keys = Object.keys(firstRow);
              // Normalize keys to find Code, Title, and Description columns
              const codeKey = keys.find(k => k.toLowerCase().includes('code')) || 'Code';
              const titleKey = keys.find(k => k.toLowerCase().includes('title')) || 'Title';
              const descKey = keys.find(k => k.toLowerCase().includes('description')) || 'Description';
  
              rows = rawJson.map(row => ({
                  Code: row[codeKey],
                  Title: row[titleKey],
                  Description: row[descKey]
              }));
          }
          return rows;
        })
        .catch(err => {
            console.warn("NAICS fetch failed", err);
            return [] as RawNaicsRow[];
        });

      // 4. Fetch and parse NVDB XLSX
      const nvdbPromise = fetch(NVDB_URL)
        .then(res => {
          if (!res.ok) throw new Error("Failed to fetch NVDB data");
          return res.arrayBuffer();
        })
        .then(buffer => {
          const workbook = XLSX.read(buffer, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          return XLSX.utils.sheet_to_json<any>(sheet);
        })
        .catch(err => {
            console.warn("NVDB fetch failed", err);
            return [] as any[];
        });

      const [jsonResults, forecasts, naicsData, processedNvdb] = await Promise.all([
          Promise.all(jsonPromises),
          forecastPromise,
          naicsPromise,
          nvdbPromise
      ]);

      const allData: AllData = Object.keys(DATA_URLS).reduce((acc, key, index) => {
        acc[key as keyof AllData] = jsonResults[index];
        return acc;
      }, {} as AllData);

      // Create maps for efficient lookups
      const centersMap = new Map(allData.centers.map(c => [String(c.center_id), c.center_name]));
      const nodeContentMap = new Map(allData.nodeContent.map(n => [String(n.nid), { title: n.title, body: n.body }]));

      // Process dashboard items
      const screenMap: { [key: string]: Screen } = {
        '/contracts': Screen.Contracts,
        '/sbs': Screen.Contacts,
        '/events': Screen.Events,
        '/top-stories': Screen.TopStories,
      };

      const processedDashboard: ProcessedDashboardItem[] = allData.dashboard
        .sort((a, b) => a.weight - b.weight)
        .map(item => {
            const imageName = item.image_url ? item.image_url.split('/').pop() : '';
            const imageUrl = imageName ? `https://d2dirmrq3rvsv0.cloudfront.net/images/${imageName}` : '';
            
            if (item.node_id && item.node_id.trim() !== '') {
                const content = nodeContentMap.get(item.node_id.trim());
                return {
                    title: item.title,
                    imageUrl,
                    screen: null,
                    content: content,
                };
            }

            return {
                title: item.title,
                imageUrl,
                screen: screenMap[item.link] || null,
            };
      });

      // Process top stories
      const processedTopStories: ProcessedTopStory[] = allData.topStories.map(story => ({
        ...story,
        body: nodeContentMap.get(String(story.nid))?.body || '<p>Content for this story could not be found.</p>',
      }));
      
      // No extra processing needed for contracts, use them directly.
      const processedContracts: Contract[] = allData.contracts;

      // Process contacts to add center name from lookup
      const processedContacts: ProcessedContact[] = allData.contacts.map((contact: RealContact) => {
        const associatedContracts: Contract[] = [];
        const photoFileName = contact.photo ? contact.photo.split('/').pop() : '';
        const centerName = centersMap.get(String(contact.center_id)) || 'Unknown Center';

        return {
          ...contact,
          photo: photoFileName ? `https://d2dirmrq3rvsv0.cloudfront.net/images/${photoFileName}` : '',
          center: centerName,
          associatedContracts,
        };
      });

      setData({ 
          ...allData, 
          processedContacts, 
          processedContracts, 
          processedTopStories,
          processedDashboard,
          forecasts,
          naicsData,
          processedNvdb
      });

    } catch (e: any) {
      setError(e.message || 'An unknown error occurred.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error };
};
