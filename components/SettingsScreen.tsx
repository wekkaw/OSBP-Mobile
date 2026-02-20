
import React from 'react';
import Header from './common/Header';
import Card from './common/Card';
import { ICONS } from '../constants';
import { useTheme, Theme } from '../contexts/ThemeContext';

const ThemeOption: React.FC<{ 
    label: string; 
    value: Theme; 
    current: Theme; 
    icon: React.ReactNode;
    onClick: (val: Theme) => void; 
}> = ({ label, value, current, icon, onClick }) => (
    <button 
        onClick={() => onClick(value)}
        className={`flex-1 flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 ${
            current === value 
            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' 
            : 'border-transparent bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
        }`}
    >
        <div className="mb-2">{icon}</div>
        <span className="text-sm font-semibold">{label}</span>
    </button>
);

const SettingsScreen: React.FC = () => {
    const { theme, setTheme } = useTheme();

    const handleResetIntro = () => {
        localStorage.removeItem('osbp_intro_video_seen');
        alert('Introduction video will play the next time you restart the app.');
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <Header title="Settings" />
            
            <section className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 ml-1">Appearance</h3>
                <Card className="p-4">
                    <div className="flex space-x-3">
                        <ThemeOption 
                            label="Light" 
                            value="light" 
                            current={theme} 
                            icon={ICONS.sun} 
                            onClick={setTheme} 
                        />
                         <ThemeOption 
                            label="Dark" 
                            value="dark" 
                            current={theme} 
                            icon={ICONS.moon} 
                            onClick={setTheme} 
                        />
                         <ThemeOption 
                            label="System" 
                            value="system" 
                            current={theme} 
                            icon={ICONS.desktop} 
                            onClick={setTheme} 
                        />
                    </div>
                </Card>
            </section>

            <section className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 ml-1">General</h3>
                <Card className="p-0 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
                    <div className="p-4 flex items-center justify-between">
                        <div>
                             <h4 className="font-semibold text-slate-800 dark:text-slate-200">Reset Intro Video</h4>
                             <p className="text-sm text-slate-500 dark:text-slate-400">Play the welcome video again on next launch</p>
                        </div>
                        <button 
                            onClick={handleResetIntro}
                            className="px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-lg transition-colors"
                        >
                            Reset
                        </button>
                    </div>
                    <div className="p-4">
                         <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-1">About</h4>
                         <p className="text-sm text-slate-500 dark:text-slate-400">
                             NASA OSBP Mobile App<br/>
                             Version 1.0.0
                         </p>
                    </div>
                </Card>
            </section>
        </div>
    );
};

export default SettingsScreen;
