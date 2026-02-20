
import React from 'react';
import { Contract } from '../types';
import Card from './common/Card';
import Header from './common/Header';
import { formatPotentialValue, formatDate } from '../utils/formatters';
import { ICONS } from '../constants';
import { useBrowser } from '../contexts/BrowserContext';

interface ContractDetailProps {
    contract: Contract;
    onBack: () => void;
    isBookmarked: boolean;
    onToggleBookmark: () => void;
    onShare: () => void;
}

const DetailRow: React.FC<{ label: string; value: string | number | undefined; href?: string; }> = ({ label, value, href }) => {
    const { openBrowser } = useBrowser();

    const handleLinkClick = (e: React.MouseEvent) => {
        if (href) {
            e.preventDefault();
            openBrowser(href, label);
        }
    };

    const content = (
        <div className="flex justify-between items-start py-3.5">
            <p className="font-medium text-slate-500 dark:text-slate-400 flex-shrink-0 mr-4">{label}</p>
            <p className={`text-right break-words ${href ? 'text-indigo-600 dark:text-indigo-400 hover:underline font-semibold' : 'text-slate-800 dark:text-slate-200'}`}>{value || 'N/A'}</p>
        </div>
    );

    if (href && value) {
        return (
            <a href={href} onClick={handleLinkClick} className="block transition-colors hover:bg-slate-500/5 dark:hover:bg-white/5 rounded-lg -mx-4 px-4">
                {content}
            </a>
        );
    }
    return <div className="-mx-4 px-4">{content}</div>;
};

const ContractDetail: React.FC<ContractDetailProps> = ({ contract, onBack, isBookmarked, onToggleBookmark, onShare }) => {
    
    const actionButtonBase = "p-2 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900 focus:ring-indigo-400 active:scale-95";
    const bookmarkButtonActive = "text-white bg-gradient-to-br from-indigo-500 to-purple-500 shadow-md shadow-indigo-500/20";
    const actionButtonInactive = "text-slate-500 dark:text-slate-400 hover:bg-slate-500/10 dark:hover:bg-white/10";
    
    return (
        <div className="animate-fade-in">
            <Header title={contract.contract_name || 'Contract Details'} onBack={onBack}>
                <div className="flex items-center space-x-2">
                    <button onClick={onToggleBookmark} className={`${actionButtonBase} ${isBookmarked ? bookmarkButtonActive : actionButtonInactive}`}>
                        <div className={`transition-transform duration-200 ${isBookmarked ? 'scale-110' : ''}`}>
                             {isBookmarked ? ICONS.bookmark : ICONS.bookmarkOutline}
                        </div>
                    </button>
                    <button onClick={onShare} className={`${actionButtonBase} ${actionButtonInactive}`}>
                        {ICONS.share}
                    </button>
                </div>
            </Header>

            <Card className="p-4">
                <div className="space-y-1 divide-y divide-slate-200/50 dark:divide-slate-700/50">
                    <DetailRow label="Contractor" value={contract.contractor_name} href={`https://www.google.com/search?q=${encodeURIComponent(contract.contractor_name)}`} />
                    <DetailRow label="Contract #" value={contract.contract_number} />
                    <DetailRow label="Potential Value" value={formatPotentialValue(contract.potential_value)} />
                    <DetailRow label="Ultimate End Date" value={formatDate(contract.ultimate_contract_end_date)} />
                    <DetailRow label="Effective Date" value={formatDate(contract.effective_date)} />
                    <DetailRow label="Competition Type" value={contract.type_of_competition} />
                    <DetailRow label="Contract Type" value={contract.contract_type} />
                    <DetailRow label="Center" value={contract.center} />
                    <DetailRow label="NAICS" value={contract.naics} href={`https://www.naics.com/search-results/?keyword=${contract.naics}`} />
                </div>
            </Card>
        </div>
    );
};

export default ContractDetail;
