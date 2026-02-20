
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface BrowserContextType {
  isOpen: boolean;
  url: string;
  title: string;
  openBrowser: (url: string, title?: string) => void;
  closeBrowser: () => void;
}

const BrowserContext = createContext<BrowserContextType | undefined>(undefined);

export const BrowserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');

  const openBrowser = (url: string, title: string = '') => {
    setUrl(url);
    setTitle(title);
    setIsOpen(true);
  };

  const closeBrowser = () => {
    setIsOpen(false);
    setUrl('');
    setTitle('');
  };

  return (
    <BrowserContext.Provider value={{ isOpen, url, title, openBrowser, closeBrowser }}>
      {children}
    </BrowserContext.Provider>
  );
};

export const useBrowser = () => {
  const context = useContext(BrowserContext);
  if (!context) {
    throw new Error('useBrowser must be used within a BrowserProvider');
  }
  return context;
};
