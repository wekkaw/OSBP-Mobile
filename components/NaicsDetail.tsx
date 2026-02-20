
import React, { useEffect, useState } from 'react';
import Header from './common/Header';
import Card from './common/Card';
import LoadingSpinner from './common/LoadingSpinner';
import { ICONS } from '../constants';
import { RawNaicsRow } from '../types';

interface NaicsDetailProps {
    code: string;
    onBack: () => void;
    naicsData: RawNaicsRow[];
}

interface NaicsData {
    title: string;
    description: string;
    examples: string[];
}

const NaicsDetail: React.FC<NaicsDetailProps> = ({ code, onBack, naicsData }) => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<NaicsData | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Since data is pre-loaded, we just need to find the record.
        // We wrap in a small timeout to allow UI to render the loading state momentarily for transition feel,
        // or just process immediately. For now, immediate processing.
        
        if (!naicsData || naicsData.length === 0) {
            setError("NAICS data is not available or failed to load.");
            setLoading(false);
            return;
        }

        try {
            const matchedRow = naicsData.find(r => String(r.Code).trim() === code.trim());

            if (matchedRow) {
                let description = matchedRow.Description || "No description available.";
                let examples: string[] = [];

                // Attempt to parse out "Illustrative Examples:"
                const examplesMarker = "Illustrative Examples:";
                const crossRefMarker = "Cross-References.";

                const examplesIndex = description.indexOf(examplesMarker);
                
                if (examplesIndex !== -1) {
                    const descPart = description.substring(0, examplesIndex).trim();
                    let examplesPart = description.substring(examplesIndex + examplesMarker.length);
                    
                    // If there is a cross-reference section, cut it off
                    const crossRefIndex = examplesPart.indexOf(crossRefMarker);
                    if (crossRefIndex !== -1) {
                        examplesPart = examplesPart.substring(0, crossRefIndex);
                    }

                    description = descPart;
                    // Split by semi-colons or new lines which are common separators in these files
                    examples = examplesPart.split(/;|•|\n/).map(s => s.trim()).filter(s => s.length > 0);
                }

                setData({
                    title: matchedRow.Title || `NAICS ${code}`,
                    description: description,
                    examples: examples,
                });
                setError(null);
            } else {
                 setError(`Code ${code} not found in the 2022 NAICS Registry.`);
            }
        } catch (err: any) {
            console.error("Error processing NAICS details:", err);
            setError("An unexpected error occurred while processing data.");
        } finally {
            setLoading(false);
        }
    }, [code, naicsData]);

    if (loading) {
        return (
            <div className="space-y-4 animate-fade-in">
                <Header title={`NAICS ${code}`} onBack={onBack} />
                <div className="flex flex-col items-center justify-center h-64 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                    <LoadingSpinner />
                    <p className="mt-4 text-slate-500 dark:text-slate-400 font-medium">Retrieving industry data...</p>
                </div>
            </div>
        );
    }

    if (error) {
         return (
            <div className="space-y-4 animate-fade-in">
                <Header title={`NAICS ${code}`} onBack={onBack} />
                <Card className="p-8 text-center bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30">
                    <div className="w-12 h-12 mx-auto text-red-400 mb-3">
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-bold text-red-600 dark:text-red-400">Unable to load details</h3>
                    <p className="text-slate-600 dark:text-slate-300 mt-2">{error}</p>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-4 animate-slide-in-up">
            <Header title={`NAICS ${code}`} onBack={onBack} />
            
            {data && (
                <div className="space-y-4">
                    <Card className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-indigo-100 dark:border-indigo-900/30">
                        <div className="flex justify-between items-start mb-2">
                             <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{data.title}</h2>
                             <span className="bg-white dark:bg-slate-800 px-2 py-1 rounded text-xs font-mono border border-slate-200 dark:border-slate-700">Official 2022</span>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">{data.description}</p>
                    </Card>

                    {data.examples.length > 0 && (
                        <Card className="p-5">
                            <div className="flex items-center space-x-2 mb-4">
                                <div className="text-indigo-500">{ICONS.briefcase}</div>
                                <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">Illustrative Examples</h3>
                            </div>
                            <ul className="space-y-2">
                                {data.examples.map((example, idx) => (
                                    <li key={idx} className="flex items-start text-sm sm:text-base">
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 mr-3 flex-shrink-0"></div>
                                        <span className="text-slate-600 dark:text-slate-300">{example}</span>
                                    </li>
                                ))}
                            </ul>
                        </Card>
                    )}
                    
                    <p className="text-center text-xs text-slate-400">
                        Source: U.S. Census Bureau 2022 NAICS Definition File
                    </p>
                </div>
            )}
        </div>
    );
};

export default NaicsDetail;
