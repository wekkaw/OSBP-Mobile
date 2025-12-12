

import React, { useState, useMemo } from 'react';
import { Contract, BookmarkType } from '../types';
import Header from './common/Header';
import Card from './common/Card';
import { ICONS } from '../constants';
import ContractItem from './ContractItem';
import ContractDetail from './ContractDetail';
import { useBookmarkContext } from '../contexts/BookmarkContext';
import { formatPotentialValue, formatDate } from '../utils/formatters';
import EmptyState from './common/EmptyState';

interface NaicsGroup {
    code: string;
    contracts: Contract[];
}

interface NaicsSearchScreenProps {
    contracts: Contract[];
}

const NaicsSearchScreen: React.FC<NaicsSearchScreenProps> = ({ contracts }) => {
    const { isBookmarked, addBookmark, removeBookmark } = useBookmarkContext();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedNaics, setSelectedNaics] = useState<NaicsGroup | null>(null);
    const [selectedContract, setSelectedContract] = useState<Contract | null>(null);

    // Group contracts by NAICS
    const naicsGroups = useMemo(() => {
        const groups: { [key: string]: Contract[] } = {};
        contracts.forEach(contract => {
            if (contract.naics) {
                // Sometimes NAICS fields contain "Code - Description", sometimes just "Code"
                const code = contract.naics.trim();
                if (!groups[code]) {
                    groups[code] = [];
                }
                groups[code].push(contract);
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
                <Header title={`NAICS: ${selectedNaics.code}`} onBack={() => setSelectedNaics(null)} />
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

    return (
        <div className="space-y-4">
            <Header title="NAICS Search" />
            
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    {ICONS.search}
                </div>
                <input
                    type="text"
                    placeholder="Search NAICS codes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border-0 rounded-xl bg-slate-100 dark:bg-slate-800/80 focus:ring-2 focus:ring-indigo-500 focus:outline-none backdrop-blur-sm shadow-sm"
                />
            </div>

            <div className="space-y-3 animate-fade-in">
                {filteredGroups.length > 0 ? (
                    filteredGroups.map(group => (
                        <Card 
                            key={group.code} 
                            onClick={() => setSelectedNaics(group)}
                            className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                        >
                            <div className="flex items-center space-x-3 overflow-hidden">
                                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg text-indigo-600 dark:text-indigo-400 flex-shrink-0">
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
                    <EmptyState 
                        icon={ICONS.hashtag}
                        title="No NAICS Codes Found"
                        message="Try adjusting your search terms."
                    />
                )}
            </div>
        </div>
    );
};

export default NaicsSearchScreen;
