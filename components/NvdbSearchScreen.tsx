import React, { useState, useMemo } from 'react';
import { NvdbRow } from '../types';
import Header from './common/Header';
import Card from './common/Card';
import { ICONS } from '../constants';

interface NvdbSearchScreenProps {
  nvdbData: NvdbRow[];
}

const NvdbSearchScreen: React.FC<NvdbSearchScreenProps> = ({ nvdbData }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [naicsFilter, setNaicsFilter] = useState('');
  const [cageFilter, setCageFilter] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(20);

  const filteredData = useMemo(() => {
    return nvdbData.filter(row => {
      // General Search
      if (searchTerm) {
        const lowerTerm = searchTerm.toLowerCase();
        const matchesSearch = Object.values(row).some(val => 
          String(val).toLowerCase().includes(lowerTerm)
        );
        if (!matchesSearch) return false;
      }

      // NAICS Filter (handles comma separated values)
      if (naicsFilter) {
        const rowNaics = String(row['NAICS'] || row['NAICS Code'] || '').toLowerCase();
        const codes = rowNaics.split(',').map(s => s.trim());
        const matchesNaics = codes.some(code => code.includes(naicsFilter.toLowerCase()));
        if (!matchesNaics) return false;
      }

      // CAGE Code Filter
      if (cageFilter) {
        const rowCage = String(row['CAGE'] || row['CAGE Code'] || '').toLowerCase();
        if (!rowCage.includes(cageFilter.toLowerCase())) return false;
      }

      // State Filter
      if (stateFilter) {
        const rowState = String(row['State'] || row['Physical State'] || '').toLowerCase();
        if (!rowState.includes(stateFilter.toLowerCase())) return false;
      }

      return true;
    });
  }, [nvdbData, searchTerm, naicsFilter, cageFilter, stateFilter]);

  const visibleData = filteredData.slice(0, visibleCount);

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 20);
  };

  const toggleExpand = (index: number) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedCards(newExpanded);
  };

  const getField = (row: NvdbRow, keys: string[]) => {
    for (const key of keys) {
      if (row[key] !== undefined && row[key] !== null) return row[key];
    }
    return 'N/A';
  };

  const clearFilters = () => {
    setSearchTerm('');
    setNaicsFilter('');
    setCageFilter('');
    setStateFilter('');
  };

  const activeFiltersCount = [naicsFilter, cageFilter, stateFilter].filter(Boolean).length;

  return (
    <div className="pb-20 animate-fade-in">
      <Header title="Vendor Database Search" />

      <div className="sticky top-0 z-10 bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-sm py-2 -mx-4 px-4 mb-4 border-b border-slate-200 dark:border-slate-800">
        {/* ... Search and Filters UI (unchanged) ... */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search vendors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all shadow-sm"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            {ICONS.search}
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors ${showFilters || activeFiltersCount > 0 ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 animate-fade-in">
                <div>
                    <label className="text-xs font-semibold text-slate-500 ml-1 mb-1 block">NAICS Code</label>
                    <input 
                        type="text" 
                        placeholder="e.g. 541330"
                        value={naicsFilter}
                        onChange={(e) => setNaicsFilter(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                    />
                </div>
                <div>
                    <label className="text-xs font-semibold text-slate-500 ml-1 mb-1 block">CAGE Code</label>
                    <input 
                        type="text" 
                        placeholder="e.g. 1A2B3"
                        value={cageFilter}
                        onChange={(e) => setCageFilter(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                    />
                </div>
                <div>
                    <label className="text-xs font-semibold text-slate-500 ml-1 mb-1 block">State</label>
                    <input 
                        type="text" 
                        placeholder="e.g. CA, TX"
                        value={stateFilter}
                        onChange={(e) => setStateFilter(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                    />
                </div>
            </div>
        )}

        <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 flex justify-between items-center">
            <span>{filteredData.length} results found</span>
            {(searchTerm || activeFiltersCount > 0) && (
                <button onClick={clearFilters} className="text-indigo-500 font-medium hover:text-indigo-600">
                    Clear All Filters
                </button>
            )}
        </div>
      </div>

      <div className="space-y-4">
        {visibleData.length > 0 ? (
          visibleData.map((row, index) => {
            const isExpanded = expandedCards.has(index);
            
            // Define fields to display in order
            const pocName = getField(row, ['POC Name', 'Contact Name', 'Point of Contact']);
            const pocEmail = getField(row, ['POC Email', 'Email', 'Contact Email']);
            const pocPhone = getField(row, ['POC Phone', 'Phone', 'Contact Phone']);
            const uei = getField(row, ['UEI', 'Unique Entity ID', 'SAM UEI']);
            const cage = getField(row, ['CAGE', 'CAGE Code', 'Cage Code']);
            const naics = getField(row, ['NAICS', 'NAICS Code', 'Primary NAICS']);
            const city = getField(row, ['City', 'Physical City']);
            const state = getField(row, ['State', 'Physical State']);

            return (
            <Card 
                key={index} 
                className={`transition-all duration-200 cursor-pointer border overflow-hidden ${isExpanded ? 'border-indigo-500 ring-1 ring-indigo-500 shadow-md' : 'hover:border-indigo-500/30 hover:shadow-sm'}`}
                onClick={() => toggleExpand(index)}
            >
              <div className="p-4 space-y-4">
                <div className="flex justify-between items-start">
                    <div className="flex-1 pr-4">
                        <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 leading-tight">
                            {getField(row, ['Vendor Name', 'Legal Business Name', 'Name', 'Company'])}
                        </h3>
                        {(city !== 'N/A' || state !== 'N/A') && (
                            <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 mt-1">
                                <span className="mr-1 opacity-70 scale-75">{ICONS.mapPin}</span>
                                <span>{city !== 'N/A' ? city : ''}{city !== 'N/A' && state !== 'N/A' ? ', ' : ''}{state !== 'N/A' ? state : ''}</span>
                            </div>
                        )}
                    </div>
                    <div className={`text-slate-400 transition-transform duration-200 ${isExpanded ? 'rotate-180 text-indigo-500' : ''}`}>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* POC Section */}
                    {(pocName !== 'N/A' || pocEmail !== 'N/A' || pocPhone !== 'N/A') && (
                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 space-y-2">
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center">
                                <span className="mr-1.5">{ICONS.users}</span> Point of Contact
                            </div>
                            {pocName !== 'N/A' && <div className="font-medium text-slate-700 dark:text-slate-200 text-sm">{pocName}</div>}
                            {pocEmail !== 'N/A' && (
                                <div className="flex items-center text-sm text-slate-600 dark:text-slate-400 break-all">
                                    <span className="mr-2 opacity-70 scale-75">{ICONS.envelope}</span>
                                    {pocEmail}
                                </div>
                            )}
                            {pocPhone !== 'N/A' && (
                                <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                                    <span className="mr-2 opacity-70 scale-75">{ICONS.phone}</span>
                                    {pocPhone}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Business Info Section */}
                    <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            {uei !== 'N/A' && (
                                <div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">UEI</div>
                                    <div className="font-mono text-sm text-slate-700 dark:text-slate-300">{uei}</div>
                                </div>
                            )}
                            {cage !== 'N/A' && (
                                <div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">CAGE</div>
                                    <div className="font-mono text-sm text-slate-700 dark:text-slate-300">{cage}</div>
                                </div>
                            )}
                        </div>
                        {naics !== 'N/A' && (
                            <div>
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">NAICS Codes</div>
                                <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                    {String(naics).split(',').slice(0, isExpanded ? undefined : 3).map((code, i) => (
                                        <span key={i} className="inline-block bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded text-slate-700 dark:text-slate-300 mr-1 mb-1 border border-slate-200 dark:border-slate-600">
                                            {code.trim()}
                                        </span>
                                    ))}
                                    {!isExpanded && String(naics).split(',').length > 3 && (
                                        <span className="text-xs text-slate-400 italic ml-1">+{String(naics).split(',').length - 3} more...</span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                
                {isExpanded && (
                    <div className="pt-4 mt-2 border-t border-slate-100 dark:border-slate-700 animate-fade-in">
                        <div className="flex flex-col">
                            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center">
                                <span className="mr-1.5">{ICONS.briefcase}</span> Capability Statement
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 border border-slate-100 dark:border-slate-700/50">
                                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                                    {getField(row, ['Capability', 'Capability Statement', 'Description', 'Capabilities']) || 'No capability statement provided.'}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
              </div>
            </Card>
          );
        })
        ) : (
          <div className="text-center py-12 text-slate-500">
            <div className="w-16 h-16 mx-auto mb-4 opacity-20">
                {ICONS.search}
            </div>
            <p>No vendors found matching your criteria</p>
            <button onClick={clearFilters} className="mt-2 text-indigo-500 font-medium hover:underline">
                Clear Filters
            </button>
          </div>
        )}

        {visibleData.length < filteredData.length && (
          <button 
            onClick={handleLoadMore}
            className="w-full py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-indigo-600 dark:text-indigo-400 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
          >
            Load More
          </button>
        )}
      </div>
    </div>
  );
};

export default NvdbSearchScreen;
