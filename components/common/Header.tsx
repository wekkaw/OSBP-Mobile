import React from 'react';
import { ICONS } from '../../constants';

interface HeaderProps {
  title: string;
  onBack?: () => void;
  children?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ title, onBack, children }) => {
  return (
    <div className="mb-8">
        <div className="flex items-center justify-between">
            <div className="flex items-center flex-1 min-w-0">
                {onBack && (
                    <button onClick={onBack} className="p-2 -ml-2 mr-2 text-slate-500 dark:text-slate-400 hover:bg-slate-500/10 dark:hover:bg-white/10 rounded-full transition-colors flex-shrink-0">
                        {ICONS.back}
                    </button>
                )}
                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent truncate" title={title}>{title}</h1>
            </div>
            <div className="flex-shrink-0 ml-4">{children}</div>
        </div>
    </div>
  );
};

export default Header;