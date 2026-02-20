
import React, { useState, useMemo } from 'react';
import { Contract, BookmarkType, RawNaicsRow } from '../types';
import Header from './common/Header';
import Card from './common/Card';
import { ICONS } from '../constants';
import ContractItem from './ContractItem';
import ContractDetail from './ContractDetail';
import { useBookmarkContext } from '../contexts/BookmarkContext';
import { formatPotentialValue, formatDate } from '../utils/formatters';
import EmptyState from './common/EmptyState';
import NaicsDetail from './NaicsDetail';

interface NaicsGroup {
    code: string;
    contracts: Contract[];
}

interface NaicsSearchScreenProps {
    contracts: Contract[];
    naicsData: RawNaicsRow[];
}

const NaicsSearchScreen: React.FC<NaicsSearchScreenProps> = ({ contracts, naicsData }) => {
    const { isBookmarked, addBookmark, removeBookmark } = useBookmarkContext();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedNaics, setSelectedNaics] = useState<NaicsGroup | null>(null);
    const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
    const [viewingCode, setViewingCode] = useState<string | null>(null);

    // Group contracts by NAICS
    const naicsGroups = useMemo(() => {
        const groups: { [key: string]: Contract[] } = {};
        contracts.forEach(contract => {
            if (contract.naics) {
                // Sometimes NAICS fields contain "Code - Description", sometimes just "Code"
                const code = contract.naics.trim();
                // Extract just the number if possible for grouping cleaner
                const codeMatch = code.match(/^(\d+)/);
                const cleanCode = codeMatch ? codeMatch[1] : code;

                if (!groups[cleanCode]) {
                    groups[cleanCode] = [];
                }
                groups[cleanCode].push(contract);
            }
        });

        return Object.entries(groups)
            .map(([code, groupContracts]) => ({
                code,
                contracts: groupContracts
            }))
            .sort((a, b) => b.contracts.length - a.contracts.length); // Sort by count desc
    }, [contracts]);

    const filteredGroups = useMemo(() => {
        if (!searchTerm) return naicsGroups;
        const lowerSearch = searchTerm.toLowerCase();
        return naicsGroups.filter(g => g.code.toLowerCase().includes(lowerSearch));
    }, [naicsGroups, searchTerm]);

    const handleToggleBookmark = (id: string) => {
        if (!id) return;
        if (isBookmarked(id, BookmarkType.Contract)) {
            removeBookmark(id, BookmarkType.Contract);
        } else {
            addBookmark(id, BookmarkType.Contract);
        }
    };

    const handleShareContract = async (contract: Contract) => {
        const shareData = {
            title: `Contract Opportunity: ${contract.contract_name}`,
            text: `Check out this contract opportunity:\nContract: ${contract.contract_name || 'N/A'}\nContractor: ${contract.contractor_name || 'N/A'}\nValue: ${formatPotentialValue(contract.potential_value)}\nEnd Date: ${formatDate(contract.ultimate_contract_end_date)}`,
            url: window.location.href,
        };
        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                alert('Sharing is not supported on this browser.');
            }
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

    // --- RENDER LOGIC ---

    if (viewingCode) {
        return (
            <NaicsDetail 
                code={viewingCode} 
                onBack={() => setViewingCode(null)} 
                naicsData={naicsData}
            />
        );
    }

    if (selectedContract) {
        return (
            <ContractDetail
                contract={selectedContract}
                onBack={() => setSelectedContract(null)}
                isBookmarked={isBookmarked(selectedContract.contract_number, BookmarkType.Contract)}
                onToggleBookmark={() => handleToggleBookmark(selectedContract.contract_number)}
                onShare={() => handleShareContract(selectedContract)}
            />
        );
    }

    if (selectedNaics) {
        return (
            <div className="space-y-4 animate-slide-in-up">
                <Header title={`NAICS: ${selectedNaics.code}`} onBack={() => setSelectedNaics(null)}>
                     <button 
                        onClick={() => setViewingCode(selectedNaics.code)}
                        className="p-2 text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-full transition-colors"
                        title="AI Insights"
                    >
                        {ICONS.sparkles}
                    </button>
                </Header>
                
                <div className="flex items-center justify-between px-1 mb-2">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        {selectedNaics.contracts.length} Opportunities found
                    </p>
                    <button 
                        onClick={() => setViewingCode(selectedNaics.code)}
                        className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center hover:underline"
                    >
                         {ICONS.sparkles} <span className="ml-1">Analyze with AI</span>
                    </button>
                </div>

                <div className="space-y-3">
                    {selectedNaics.contracts.map(contract => (
                        <ContractItem
                            key={contract.id}
                            contract={contract}
                            isBookmarked={isBookmarked(contract.contract_number, BookmarkType.Contract)}
                            onClick={() => setSelectedContract(contract)}
                            onToggleBookmark={() => handleToggleBookmark(contract.contract_number)}
                            onShare={() => handleShareContract(contract)}
                        />
                    ))}
                </div>
            </div>
        );
    }

    // Identify if the search term looks like a specific NAICS code (3-6 digits)
    const isSearchNumeric = /^\d{3,6}$/.test(searchTerm.trim());

    return (
        <div className="space-y-4">
            <Header title="NAICS Search" />
            
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    {ICONS.search}
                </div>
                <input
                    type="text"
                    placeholder="Search NAICS codes (e.g. 541330)..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border-0 rounded-xl bg-slate-100 dark:bg-slate-800/80 focus:ring-2 focus:ring-indigo-500 focus:outline-none backdrop-blur-sm shadow-sm"
                />
            </div>

            <div className="space-y-3 animate-fade-in">
                {/* Always offer to lookup the code if it looks like one, regardless of local results */}
                {isSearchNumeric && (
                    <Card 
                        onClick={() => setViewingCode(searchTerm.trim())}
                        className="p-4 flex items-center space-x-4 cursor-pointer hover:shadow-lg border border-indigo-200 dark:border-indigo-900 bg-indigo-50/50 dark:bg-indigo-900/10 group"
                    >
                        <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                            {ICONS.sparkles}
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-indigo-700 dark:text-indigo-300">Lookup details for {searchTerm}</h3>
                            <p className="text-sm text-indigo-600/80 dark:text-indigo-300/80">Retrieve definition and activities from Census data.</p>
                        </div>
                         <div className="text-indigo-400">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </Card>
                )}

                {filteredGroups.length > 0 ? (
                    filteredGroups.map(group => (
                        <Card 
                            key={group.code} 
                            onClick={() => setSelectedNaics(group)}
                            className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                        >
                            <div className="flex items-center space-x-3 overflow-hidden">
                                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400 flex-shrink-0">
                                    {ICONS.hashtag}
                                </div>
                                <div className="min-w-0">
                                    <h3 className="font-semibold text-slate-800 dark:text-slate-200 truncate pr-2">{group.code}</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        {group.contracts.length} {group.contracts.length === 1 ? 'Opportunity' : 'Opportunities'}
                                    </p>
                                </div>
                            </div>
                            <div className="text-slate-400">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </Card>
                    ))
                ) : (
                    !isSearchNumeric && (
                        <EmptyState 
                            icon={ICONS.hashtag}
                            title="No Contracts Found"
                            message="Type a valid NAICS code to search external details."
                        />
                    )
                )}
            </div>
        </div>
    );
};

export default NaicsSearchScreen;
