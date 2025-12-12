
import React, { useMemo } from 'react';
import { ProcessedDashboardItem, Screen, Contract, Event, ForecastItem } from '../types';
import Header from './common/Header';
import Card from './common/Card';
import { ICONS } from '../constants';
import { formatPotentialValue } from '../utils/formatters';

interface DashboardScreenProps {
  dashboardItems: ProcessedDashboardItem[]; // Kept for legacy compatibility if needed
  contracts: Contract[];
  events: Event[];
  forecasts: ForecastItem[];
  setActiveScreen: (screen: Screen) => void;
}

// Helper to parse value strings like "$5M", "$100K" into numbers
const parseValue = (valStr: string): number => {
    if (!valStr) return 0;
    const cleanStr = valStr.replace(/[^0-9.KMB]/g, '');
    let multiplier = 1;
    if (cleanStr.endsWith('B')) multiplier = 1000000000;
    else if (cleanStr.endsWith('M')) multiplier = 1000000;
    else if (cleanStr.endsWith('K')) multiplier = 1000;
    
    const num = parseFloat(cleanStr.replace(/[KMB]/g, ''));
    return isNaN(num) ? 0 : num * multiplier;
};

// --- Sub-components for the Dashboard ---

const StatCard: React.FC<{ title: string; value: string | number; subtext: string; icon: React.ReactNode; colorClass: string }> = ({ title, value, subtext, icon, colorClass }) => (
    <Card className="p-4 flex items-center justify-between relative overflow-hidden group">
        <div className="relative z-10">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1">{value}</h3>
            <p className="text-xs text-slate-400 mt-1">{subtext}</p>
        </div>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${colorClass} bg-opacity-10 text-opacity-100`}>
            {icon}
        </div>
        <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-5 ${colorClass}`}></div>
    </Card>
);

const SectionHeader: React.FC<{ title: string; action?: string; onAction?: () => void }> = ({ title, action, onAction }) => (
    <div className="flex justify-between items-end mb-3 px-1">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">{title}</h2>
        {action && (
            <button onClick={onAction} className="text-xs font-semibold text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-300">
                {action} &rarr;
            </button>
        )}
    </div>
);

const DashboardScreen: React.FC<DashboardScreenProps> = ({ contracts, events, forecasts, setActiveScreen }) => {
  
  // --- Metric Calculations ---
  const metrics = useMemo(() => {
    const rfps = contracts.filter(c => c.is_rfp);
    const awarded = contracts.filter(c => !c.is_rfp);
    const totalContractValue = awarded.reduce((acc, c) => acc + parseValue(c.potential_value), 0);
    
    // Group Contracts by Center (Top 5)
    const centerCounts: {[key: string]: number} = {};
    awarded.forEach(c => {
        const center = c.center || 'Other';
        centerCounts[center] = (centerCounts[center] || 0) + 1;
    });
    const topCenters = Object.entries(centerCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([name, count], i) => ({ 
            name, 
            count, 
            percentage: (count / awarded.length) * 100,
            color: ['bg-indigo-500', 'bg-purple-500', 'bg-blue-500', 'bg-teal-500', 'bg-slate-400'][i] || 'bg-slate-400'
        }));

    // Group Forecasts by Phase
    const forecastPhaseCounts: {[key: string]: number} = {};
    forecasts.forEach(f => {
        // Need to fuzzy match keys because ForecastItem is loose
        const keys = Object.keys(f);
        const phaseKey = keys.find(k => k.toLowerCase().includes('phase'));
        const phase = phaseKey ? f[phaseKey] : 'Unknown';
        forecastPhaseCounts[phase] = (forecastPhaseCounts[phase] || 0) + 1;
    });
    // Remove empty/n/a
    delete forecastPhaseCounts['undefined'];
    delete forecastPhaseCounts['N/A'];

    const topPhases = Object.entries(forecastPhaseCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 4);

    return {
        rfpCount: rfps.length,
        contractCount: awarded.length,
        totalValue: totalContractValue,
        forecastCount: forecasts.length,
        upcomingEvents: events.filter(e => new Date(e.date) >= new Date()).length,
        topCenters,
        topPhases
    };
  }, [contracts, events, forecasts]);

  const formatCurrency = (val: number) => {
      if (val >= 1000000000) return `$${(val / 1000000000).toFixed(1)}B`;
      if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
      return `$${val.toLocaleString()}`;
  };

  return (
    <div className="space-y-6 pb-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Executive Dashboard</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Welcome back, here is your daily overview.</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden border-2 border-white dark:border-slate-600 shadow-sm">
             <img src="https://ui-avatars.com/api/?name=User&background=6366f1&color=fff" alt="User" />
        </div>
      </div>

      {/* --- Key Metrics Grid --- */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard 
            title="Total Contracts" 
            value={metrics.contractCount} 
            subtext={`${formatCurrency(metrics.totalValue)} Value`}
            icon={ICONS.contracts}
            colorClass="bg-indigo-500 text-indigo-500"
        />
        <StatCard 
            title="Active RFPs" 
            value={metrics.rfpCount} 
            subtext="Open Opportunities"
            icon={ICONS.megaphone}
            colorClass="bg-amber-500 text-amber-500"
        />
        <StatCard 
            title="Forecasts" 
            value={metrics.forecastCount} 
            subtext="Future Pipeline"
            icon={ICONS.chart}
            colorClass="bg-emerald-500 text-emerald-500"
        />
        <StatCard 
            title="Events" 
            value={metrics.upcomingEvents} 
            subtext="Upcoming"
            icon={ICONS.events}
            colorClass="bg-rose-500 text-rose-500"
        />
      </div>

      {/* --- Charts Section --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Contracts by Center */}
          <div>
            <SectionHeader title="Top Centers by Award Volume" />
            <Card className="p-5">
                <div className="space-y-4">
                    {metrics.topCenters.map(center => (
                        <div key={center.name}>
                            <div className="flex justify-between text-xs font-semibold mb-1 text-slate-600 dark:text-slate-300">
                                <span>{center.name}</span>
                                <span>{center.count}</span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                                <div 
                                    className={`h-2 rounded-full ${center.color}`} 
                                    style={{ width: `${center.percentage}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
          </div>

          {/* Forecast Pipeline */}
          <div>
             <SectionHeader title="Acquisition Pipeline Phase" action="View Forecasts" onAction={() => setActiveScreen(Screen.Forecasts)} />
             <Card className="p-5 flex flex-col justify-center h-full">
                <div className="flex items-center justify-center space-x-6">
                    <div className="relative w-32 h-32">
                         <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                            {/* Simple Doughnut Representation */}
                            <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#e2e8f0" strokeWidth="3" className="dark:stroke-slate-700" />
                            <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#6366f1" strokeWidth="3" strokeDasharray="60, 100" />
                            <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#ec4899" strokeWidth="3" strokeDasharray="25, 100" strokeDashoffset="-60" />
                            <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#10b981" strokeWidth="3" strokeDasharray="15, 100" strokeDashoffset="-85" />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center flex-col">
                            <span className="text-2xl font-bold text-slate-800 dark:text-slate-200">{metrics.forecastCount}</span>
                            <span className="text-[10px] text-slate-400 uppercase">Total</span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        {metrics.topPhases.map(([phase, count], idx) => (
                            <div key={phase} className="flex items-center text-xs">
                                <span className={`w-2 h-2 rounded-full mr-2 ${['bg-indigo-500', 'bg-pink-500', 'bg-emerald-500', 'bg-slate-400'][idx] || 'bg-slate-400'}`}></span>
                                <span className="text-slate-600 dark:text-slate-300 flex-1 truncate max-w-[100px]">{phase}</span>
                                <span className="font-bold ml-2">{count}</span>
                            </div>
                        ))}
                    </div>
                </div>
             </Card>
          </div>
      </div>

      {/* --- Quick Actions / Navigation Cards --- */}
      <div>
        <SectionHeader title="Quick Actions" />
        <div className="grid grid-cols-2 gap-3">
             <div onClick={() => setActiveScreen(Screen.Contracts)} className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white p-4 rounded-xl shadow-lg shadow-indigo-500/20 cursor-pointer hover:scale-[1.02] transition-transform">
                <div className="text-white/80 mb-2">{ICONS.search}</div>
                <h3 className="font-bold">Find Contracts</h3>
                <p className="text-xs text-indigo-100 opacity-80 mt-1">Search active opportunities</p>
             </div>
             <div onClick={() => setActiveScreen(Screen.Contacts)} className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/80 transition-colors">
                <div className="text-indigo-500 mb-2">{ICONS.users}</div>
                <h3 className="font-bold text-slate-800 dark:text-slate-200">Connect</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Reach out to specialists</p>
             </div>
        </div>
      </div>

    </div>
  );
};

export default DashboardScreen;
