import React from 'react';
import { ProcessedContact } from '../types';
import Card from './common/Card';
import { ICONS } from '../constants';

interface ContactItemProps { 
    contact: ProcessedContact;
    isBookmarked: boolean;
    onClick: () => void;
    onToggleBookmark: () => void;
    onShare: () => void;
    onSave: () => void;
    onSlack: () => void;
}

const ContactItem: React.FC<ContactItemProps> = ({ contact, isBookmarked, onClick, onToggleBookmark, onShare, onSave, onSlack }) => {
    const actionButtonBase = "flex-1 flex items-center justify-center space-x-2 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900 focus:ring-indigo-400 active:scale-95";
    const bookmarkButtonActive = "text-white bg-gradient-to-br from-indigo-500 to-purple-500 shadow-md shadow-indigo-500/20";
    const actionButtonInactive = "text-slate-600 dark:text-slate-300 hover:bg-slate-500/10 dark:hover:bg-white/10";

    const handleActionClick = (e: React.MouseEvent, action: () => void) => {
        e.stopPropagation();
        action();
    };

    return (
        <Card className="p-0 overflow-hidden group">
            <div className="p-4 cursor-pointer" onClick={onClick}>
                <div className="flex items-start space-x-4">
                    <div className="relative flex-shrink-0">
                        <img
                            src={contact.photo}
                            alt={contact.name}
                            className="w-20 h-20 rounded-full border-2 border-white/50 dark:border-slate-700/50 object-cover bg-slate-200"
                        />
                         <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-30 blur-lg transition-opacity duration-300"></div>
                    </div>
                    <div className="flex-grow pt-1">
                        <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{contact.name}</h3>
                        <p className="text-slate-600 dark:text-slate-400 font-medium text-sm -mt-1">{contact.title}</p>
                        <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 mt-2">
                            <div className="w-5 h-5 mr-2 flex-shrink-0 text-slate-400 dark:text-slate-500">{ICONS.building}</div>
                            <span className="truncate">{contact.center}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-slate-50/50 dark:bg-slate-900/20 border-t border-white/50 dark:border-slate-700/50 flex items-center justify-around px-2 py-1.5 space-x-1">
                <button onClick={(e) => handleActionClick(e, onToggleBookmark)} className={`${actionButtonBase} ${isBookmarked ? bookmarkButtonActive : actionButtonInactive}`}>
                    <div className={`transition-transform duration-200 ${isBookmarked ? 'text-glow' : ''}`}>
                        {isBookmarked ? ICONS.bookmark : ICONS.bookmarkOutline}
                    </div>
                    <span className="text-xs">{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
                </button>
                <button onClick={(e) => handleActionClick(e, onShare)} className={`${actionButtonBase} ${actionButtonInactive}`}>
                    {ICONS.share} <span className="text-xs">Share</span>
                </button>
                <button onClick={(e) => handleActionClick(e, onSave)} className={`${actionButtonBase} ${actionButtonInactive}`}>
                    {ICONS.save} <span className="text-xs">Save</span>
                </button>
                 <button onClick={(e) => handleActionClick(e, onSlack)} className={`${actionButtonBase} ${actionButtonInactive}`}>
                    {ICONS.slack} <span className="text-xs">Slack</span>
                </button>
            </div>
        </Card>
    );
};

export default ContactItem;