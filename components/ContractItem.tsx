import React from 'react';
import { Contract } from '../types';
import Card from './common/Card';
import { formatPotentialValue, formatDate } from '../utils/formatters';
import { ICONS } from '../constants';

interface ContractItemProps {
  contract: Contract;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  onShare: () => void;
  onClick: () => void;
}

const ContractItem: React.FC<ContractItemProps> = ({ contract, isBookmarked, onClick, onToggleBookmark, onShare }) => {
    const actionButtonBase = "flex-1 flex items-center justify-center space-x-2 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900 focus:ring-indigo-400 active:scale-95";
    const bookmarkButtonActive = "text-white bg-gradient-to-br from-indigo-500 to-purple-500 shadow-md shadow-indigo-500/20";
    const actionButtonInactive = "text-slate-600 dark:text-slate-300 hover:bg-slate-500/10 dark:hover:bg-white/10";
    
    const handleActionClick = (e: React.MouseEvent, action: () => void) => {
        e.stopPropagation();
        action();
    };

    return (
        <Card className="p-0 overflow-hidden group">
            <div className="p-4 space-y-3 cursor-pointer" onClick={onClick}>
                <div>
                    <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{contract.contract_name || 'Unnamed Contract'}</h3>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{contract.contractor_name || 'Unknown Contractor'}</p>
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400 grid grid-cols-2 gap-x-4 gap-y-2 pt-3 border-t border-slate-200/50 dark:border-slate-700/50">
                <div>
                    <p className="font-semibold text-slate-600 dark:text-slate-300">Contract #</p> 
                    <p>{contract.contract_number}</p>
                </div>
                <div className="text-right">
                    <p className="font-semibold text-slate-600 dark:text-slate-300">Potential Value</p> 
                    <p className="font-mono">{formatPotentialValue(contract.potential_value)}</p>
                </div>
                <div>
                    <p className="font-semibold text-slate-600 dark:text-slate-300">End Date</p> 
                    <p>{formatDate(contract.ultimate_contract_end_date)}</p>
                </div>
                </div>
            </div>
            <div className="bg-slate-50/50 dark:bg-slate-900/20 border-t border-white/50 dark:border-slate-700/50 flex items-center justify-around px-2 py-1.5 space-x-2">
                <button 
                    onClick={(e) => handleActionClick(e, onToggleBookmark)}
                    className={`${actionButtonBase} ${isBookmarked ? bookmarkButtonActive : actionButtonInactive}`}
                >
                    <div className={`transition-transform duration-200 ${isBookmarked ? 'text-glow' : ''}`}>
                        {isBookmarked ? ICONS.bookmark : ICONS.bookmarkOutline}
                    </div>
                    <span>{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
                </button>
                <button 
                    onClick={(e) => handleActionClick(e, onShare)}
                    className={`${actionButtonBase} ${actionButtonInactive}`}
                >
                    {ICONS.share}
                    <span>Share</span>
                </button>
            </div>
        </Card>
    );
};

export default ContractItem;