import React, { useState } from 'react';
import { useData } from './hooks/useData';
import { BookmarkProvider } from './contexts/BookmarkContext';
import BottomNav from './components/BottomNav';
import DashboardScreen from './components/DashboardScreen';
import ContactsScreen from './components/ContactsScreen';
import ContractsScreen from './components/ContractsScreen';
import EventsScreen from './components/EventsScreen';
import LoadingSpinner from './components/common/LoadingSpinner';
import { Screen } from './types';
import TopStoriesScreen from './components/TopStoriesScreen';
import BookmarksScreen from './components/BookmarksScreen';
import ChatbotFab from './components/ChatbotFab';
import Chatbot from './components/Chatbot';

const AppContent: React.FC = () => {
  const [activeScreen, setActiveScreen] = useState<Screen>(Screen.Dashboard);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const { data, loading, error } = useData();

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
      case Screen.Events:
        return <EventsScreen events={data.events} />;
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
      default:
        return <DashboardScreen 
          dashboardItems={data.processedDashboard} 
          setActiveScreen={setActiveScreen}
        />;
    }
  };

  return (
    <div className="min-h-screen font-sans text-slate-800 dark:text-slate-200">
      <div className="max-w-lg mx-auto bg-slate-50/50 dark:bg-slate-900/50 min-h-[100dvh] flex flex-col border-x border-slate-200/50 dark:border-slate-800/50 shadow-2xl shadow-black/10">
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
    <BookmarkProvider>
      <AppContent />
    </BookmarkProvider>
  );
};

export default App;