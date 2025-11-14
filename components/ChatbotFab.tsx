import React from 'react';
import { ICONS } from '../constants';

interface ChatbotFabProps {
    onClick: () => void;
}

const ChatbotFab: React.FC<ChatbotFabProps> = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="fixed bottom-24 right-4 z-40 w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-800"
            aria-label="Open AI Assistant"
        >
            <div className="w-8 h-8">
                {ICONS.chat}
            </div>
        </button>
    );
};

export default ChatbotFab;
