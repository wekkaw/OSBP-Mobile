import React, { useState } from 'react';
import { ProcessedDashboardItem, Screen } from '../types';
import Header from './common/Header';
import ContentDetail from './common/ContentDetail';

interface DashboardScreenProps {
  dashboardItems: ProcessedDashboardItem[];
  setActiveScreen: (screen: Screen) => void;
}

type Content = {
    title: string;
    body: string;
    imageUrl?: string;
};

const DashboardCard: React.FC<{ item: ProcessedDashboardItem; onClick: () => void }> = ({ item, onClick }) => (
    <div onClick={onClick} className="cursor-pointer group rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative aspect-square">
        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 p-4 flex flex-col justify-end">
            <h3 className="text-white font-bold text-lg leading-tight drop-shadow-md">{item.title}</h3>
        </div>
        <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/10 group-hover:ring-white/20 transition-all duration-300"></div>
    </div>
);

const DashboardScreen: React.FC<DashboardScreenProps> = ({ dashboardItems, setActiveScreen }) => {
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);

  if (selectedContent) {
    return <ContentDetail content={selectedContent} onBack={() => setSelectedContent(null)} />;
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Header title="Dashboard" />
        <p className="text-slate-500 dark:text-slate-400 -mt-8 mb-4">Welcome back, here's your overview.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 animate-fade-in">
        {dashboardItems.map(item => (
            <DashboardCard 
                key={item.title} 
                item={item} 
                onClick={() => {
                    if (item.content) {
                        setSelectedContent(item.content);
                    } else if (item.screen) {
                        setActiveScreen(item.screen);
                    }
                }} 
            />
        ))}
      </div>
    </div>
  );
};

export default DashboardScreen;