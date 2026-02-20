
import React, { useEffect } from 'react';
import { Screen } from '../types';
import { ICONS } from '../constants';

interface HamburgerMenuProps {
    isOpen: boolean;
    onClose: () => void;
    activeScreen: Screen;
    setActiveScreen: (screen: Screen) => void;
}

const MenuItem: React.FC<{
    label: string;
    icon: React.ReactNode;
    isActive: boolean;
    onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
            isActive 
                ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-semibold' 
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
        }`}
    >
        <div className={`w-5 h-5 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`}>
            {icon}
        </div>
        <span>{label}</span>
    </button>
);

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ isOpen, onClose, activeScreen, setActiveScreen }) => {
    
    // Disable body scroll when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const handleNavigation = (screen: Screen) => {
        setActiveScreen(screen);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            ></div>

            {/* Sidebar */}
            <div className="relative w-72 h-full bg-white dark:bg-slate-900 shadow-2xl animate-slide-in-left flex flex-col z-10">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                    <div>
                         <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">Menu</h2>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 -mr-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    <MenuItem 
                        label="Dashboard" 
                        icon={ICONS.dashboard} 
                        isActive={activeScreen === Screen.Dashboard} 
                        onClick={() => handleNavigation(Screen.Dashboard)} 
                    />
                    <MenuItem 
                        label="Contracts & RFPs" 
                        icon={ICONS.contracts} 
                        isActive={activeScreen === Screen.Contracts} 
                        onClick={() => handleNavigation(Screen.Contracts)} 
                    />
                    <MenuItem 
                        label="Contacts" 
                        icon={ICONS.contacts} 
                        isActive={activeScreen === Screen.Contacts} 
                        onClick={() => handleNavigation(Screen.Contacts)} 
                    />
                    <MenuItem 
                        label="Forecasts" 
                        icon={ICONS.chart} 
                        isActive={activeScreen === Screen.Forecasts} 
                        onClick={() => handleNavigation(Screen.Forecasts)} 
                    />
                    <MenuItem 
                        label="NAICS Search" 
                        icon={ICONS.hashtag} 
                        isActive={activeScreen === Screen.NaicsSearch} 
                        onClick={() => handleNavigation(Screen.NaicsSearch)} 
                    />
                    <MenuItem 
                        label="Vendor Database" 
                        icon={ICONS.database} 
                        isActive={activeScreen === Screen.Nvdb} 
                        onClick={() => handleNavigation(Screen.Nvdb)} 
                    />
                    <div className="my-2 border-t border-slate-100 dark:border-slate-800"></div>
                     <MenuItem 
                        label="Events" 
                        icon={ICONS.events} 
                        isActive={activeScreen === Screen.Events} 
                        onClick={() => handleNavigation(Screen.Events)} 
                    />
                    <MenuItem 
                        label="Top Stories" 
                        icon={ICONS.newspaper} 
                        isActive={activeScreen === Screen.TopStories} 
                        onClick={() => handleNavigation(Screen.TopStories)} 
                    />
                    <div className="my-2 border-t border-slate-100 dark:border-slate-800"></div>
                    <MenuItem 
                        label="Bookmarks" 
                        icon={ICONS.bookmarkOutline} 
                        isActive={activeScreen === Screen.Bookmarks} 
                        onClick={() => handleNavigation(Screen.Bookmarks)} 
                    />
                     <div className="my-2 border-t border-slate-100 dark:border-slate-800"></div>
                     <MenuItem 
                        label="Settings" 
                        icon={ICONS.settings} 
                        isActive={activeScreen === Screen.Settings} 
                        onClick={() => handleNavigation(Screen.Settings)} 
                    />
                </div>
                
                <div className="p-4 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-400">
                    <p>NASA OSBP Mobile</p>
                    <p>Version 1.0.0</p>
                </div>
            </div>
        </div>
    );
};

export default HamburgerMenu;
