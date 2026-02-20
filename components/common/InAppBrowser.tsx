
import React, { useState, useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface InAppBrowserProps {
  url: string;
  title?: string;
  isOpen: boolean;
  onClose: () => void;
}

const InAppBrowser: React.FC<InAppBrowserProps> = ({ url, title, isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);

  // Reset loading state when url changes or modal opens
  useEffect(() => {
    if (isOpen) setIsLoading(true);
  }, [isOpen, url]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-white dark:bg-slate-900 flex flex-col animate-slide-in-up">
      <div className="flex items-center justify-between p-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm z-10">
        <button 
          onClick={onClose}
          className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full focus:outline-none"
          aria-label="Close Browser"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="flex-1 px-4 text-center overflow-hidden">
             <h3 className="font-bold text-slate-800 dark:text-slate-200 truncate text-sm">
                {title || 'External Link'}
             </h3>
             <p className="text-xs text-slate-400 truncate opacity-80">{url}</p>
        </div>
        <a 
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-full focus:outline-none"
          title="Open in System Browser"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
      <div className="flex-1 relative bg-slate-100 dark:bg-slate-800">
        {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <LoadingSpinner />
            </div>
        )}
        <iframe 
            src={url} 
            className="w-full h-full border-0"
            title="External Content"
            sandbox="allow-forms allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
            onLoad={() => setIsLoading(false)}
        />
      </div>
    </div>
  );
};

export default InAppBrowser;
