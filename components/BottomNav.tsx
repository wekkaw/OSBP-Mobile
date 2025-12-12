


import React from 'react';
import { Screen } from '../types';
import { ICONS } from '../constants';

interface BottomNavProps {
  activeScreen: Screen;
  setActiveScreen: (screen: Screen) => void;
}

const NavItem: React.FC<{
  label: Screen;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex-1 flex flex-col items-center justify-center h-full transition-colors duration-300 group focus:outline-none relative pt-2 pb-1"
      aria-label={label}
    >
      <div className={`transition-all duration-300 transform text-slate-500 dark:text-slate-400 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 ${isActive ? 'text-indigo-500 dark:text-indigo-400' : ''}`}>
        {icon}
      </div>
      <span className={`text-[10px] mt-1 transition-all duration-300 font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-full px-0.5 ${isActive ? 'opacity-100 text-indigo-500 dark:text-indigo-400' : 'opacity-0'}`}>
        {label === Screen.NaicsSearch ? 'NAICS' : label}
      </span>
    </button>
  );
};

const BottomNav: React.FC<BottomNavProps> = ({ activeScreen, setActiveScreen }) => {
  const navItems = [
    { label: Screen.Dashboard, icon: ICONS.dashboard },
    { label: Screen.Contracts, icon: ICONS.contracts },
    { label: Screen.Contacts, icon: ICONS.contacts },
    { label: Screen.Forecasts, icon: ICONS.chart },
    { label: Screen.NaicsSearch, icon: ICONS.hashtag },
    { label: Screen.Events, icon: ICONS.events },
    { label: Screen.Bookmarks, icon: ICONS.bookmarkOutline },
  ];
  
  const activeIndex = navItems.findIndex(item => item.label === activeScreen);
  const widthPercentage = 100 / navItems.length;

  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto h-20 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border-t border-white/20 dark:border-slate-800/20 z-50">
      <div className="flex justify-around items-stretch h-full relative">
        <div 
          className="absolute top-0 h-full flex justify-center items-center transition-transform duration-300 ease-in-out"
          style={{ 
              transform: `translateX(${activeIndex * 100}%)`,
              width: `${widthPercentage}%`
          }}
        >
          <div className="h-12 w-full mx-1 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/50 dark:to-purple-900/50 rounded-2xl"></div>
        </div>
        {navItems.map((item) => (
          <div key={item.label} className="flex-1 z-10 min-w-0">
            <NavItem
              label={item.label}
              icon={item.icon}
              isActive={activeScreen === item.label}
              onClick={() => setActiveScreen(item.label)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;