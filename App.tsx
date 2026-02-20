
import React, { useState, useEffect } from 'react';
import { useData } from './hooks/useData';
import { BookmarkProvider } from './contexts/BookmarkContext';
import { BrowserProvider, useBrowser } from './contexts/BrowserContext';
import { ThemeProvider } from './contexts/ThemeContext';
import BottomNav from './components/BottomNav';
import DashboardScreen from './components/DashboardScreen';
import ContactsScreen from './components/ContactsScreen';
import ContractsScreen from './components/ContractsScreen';
import LoadingSpinner from './components/common/LoadingSpinner';
import { Screen } from './types';
import TopStoriesScreen from './components/TopStoriesScreen';
import BookmarksScreen from './components/BookmarksScreen';
import ChatbotFab from './components/ChatbotFab';
import Chatbot from './components/Chatbot';
import NaicsSearchScreen from './components/NaicsSearchScreen';
import NvdbSearchScreen from './components/NvdbSearchScreen';
import ForecastsScreen from './components/ForecastsScreen';
import EventGuideScreen from './components/EventGuideScreen';
import IntroVideo from './components/IntroVideo';
import InAppBrowser from './components/common/InAppBrowser';
import HamburgerMenu from './components/HamburgerMenu';
import SettingsScreen from './components/SettingsScreen';
import { ICONS } from './constants';

const AppContent: React.FC = () => {
  const [activeScreen, setActiveScreen] = useState<Screen>(Screen.Dashboard);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showIntroVideo, setShowIntroVideo] = useState(false);
  const { data, loading, error } = useData();
  const { isOpen, url, title, closeBrowser } = useBrowser();

  useEffect(() => {
    // Check local storage to see if the user has opted to hide the intro video
    const hasSeenIntro = localStorage.getItem('osbp_intro_video_seen');
    if (!hasSeenIntro) {
      setShowIntroVideo(true);
    }
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-full pt-16">
          <LoadingSpinner />
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-full text-center text-red-500">
          <div className="p-4 bg-red-100 rounded-lg">
            <h2 className="font-bold text-lg">Error loading data</h2>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      );
    }

    if (!data) {
      return (
        <div className="flex items-center justify-center h-full text-slate-500">
          No data available.
        </div>
      );
    }

    switch (activeScreen) {
      case Screen.Dashboard:
        return <DashboardScreen 
          dashboardItems={data.processedDashboard} 
          contracts={data.processedContracts}
          events={data.events}
          forecasts={data.forecasts}
          nvdbData={data.processedNvdb}
          setActiveScreen={setActiveScreen}
        />;
      case Screen.Contracts:
        return <ContractsScreen 
          contracts={data.processedContracts} 
        />;
      case Screen.Contacts:
        return <ContactsScreen 
          contacts={data.processedContacts}
        />;
      case Screen.NaicsSearch:
        return <NaicsSearchScreen
          contracts={data.processedContracts}
          naicsData={data.naicsData}
        />;
      case Screen.Nvdb:
        return <NvdbSearchScreen nvdbData={data.processedNvdb} />;
      case Screen.Forecasts:
        return <ForecastsScreen 
            contacts={data.processedContacts} 
            forecasts={data.forecasts} 
        />;
      case Screen.Events:
        return <EventGuideScreen />;
      case Screen.TopStories:
        return <TopStoriesScreen 
          stories={data.processedTopStories} 
          onBack={() => setActiveScreen(Screen.Dashboard)}
        />;
      case Screen.Bookmarks:
        return <BookmarksScreen
          allContacts={data.processedContacts}
          allContracts={data.processedContracts}
        />;
      case Screen.Settings:
        return <SettingsScreen />;
      default:
        return <DashboardScreen 
          dashboardItems={data.processedDashboard}
          contracts={data.processedContracts}
          events={data.events}
          forecasts={data.forecasts}
          nvdbData={data.processedNvdb}
          setActiveScreen={setActiveScreen}
        />;
    }
  };

  return (
    <div className="min-h-screen font-sans text-slate-800 dark:text-slate-200">
      {showIntroVideo && <IntroVideo onClose={() => setShowIntroVideo(false)} />}
      <InAppBrowser isOpen={isOpen} url={url} title={title} onClose={closeBrowser} />
      <HamburgerMenu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
        activeScreen={activeScreen} 
        setActiveScreen={setActiveScreen} 
      />
      
      <div className="max-w-lg mx-auto bg-slate-50/50 dark:bg-slate-900/50 min-h-[100dvh] flex flex-col border-x border-slate-200/50 dark:border-slate-800/50 shadow-2xl shadow-black/10">
        <div className="w-full bg-white dark:bg-slate-900 border-b border-slate-200/50 dark:border-slate-800/50 relative">
             <img 
                src="https://et-media-networks-751117994400.us-west1.run.app/images/osbp-mobile-header-2026.jpg" 
                alt="OSBP Header" 
                className="w-full h-auto object-cover block"
             />
             <button 
                onClick={() => setIsMenuOpen(true)}
                className="absolute top-1/2 -translate-y-1/2 left-4 p-2 bg-black/30 hover:bg-black/50 backdrop-blur-md rounded-full text-white transition-colors border border-white/20"
                aria-label="Open Menu"
             >
               <div className="w-6 h-6">
                 {ICONS.menu}
               </div>
             </button>
        </div>
        <main className="flex-grow p-4 pb-24">
          {renderContent()}
        </main>
        <BottomNav activeScreen={activeScreen} setActiveScreen={setActiveScreen} />
        <ChatbotFab onClick={() => setIsChatbotOpen(true)} />
        {isChatbotOpen && <Chatbot onClose={() => setIsChatbotOpen(false)} data={data}/>}
      </div>
    </div>
  );
};


const App: React.FC = () => {
  return (
    <ThemeProvider>
      <BookmarkProvider>
        <BrowserProvider>
          <AppContent />
        </BrowserProvider>
      </BookmarkProvider>
    </ThemeProvider>
  );
};

export default App;
