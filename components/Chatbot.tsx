import React, { useState, useEffect, useRef } from 'react';
import { ICONS } from '../constants';
import Card from './common/Card';

interface Message {
    role: 'user' | 'model';
    text: string;
}

interface ChatbotProps {
    onClose: () => void;
}

const TypingIndicator: React.FC = () => (
    <div className="flex items-center space-x-1.5">
        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
    </div>
);

const Chatbot: React.FC<ChatbotProps> = ({ onClose }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const messagesEndRef = useRef<null | HTMLDivElement>(null);
    const systemInstruction = 'You are a helpful AI assistant for a "Small Business Opportunities" dashboard. Your goal is to help users understand the data, find information about government contracts, locate key contacts, and stay informed about relevant events. Keep your answers concise and professional.';

    useEffect(() => {
        if (!process.env.LIGHTLLM_API_ENDPOINT) {
            console.error("LightLLM API endpoint is not configured.");
            setError("Chatbot is not configured. Please provide an API endpoint.");
        } else {
            setMessages([{
                role: 'model',
                text: "Hello! I'm your AI assistant. How can I help you find small business opportunities today?"
            }]);
        }
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { role: 'user', text: input };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);
        setError(null);

        try {
            if (!process.env.LIGHTLLM_API_ENDPOINT) {
                throw new Error("LightLLM API endpoint is not configured.");
            }

            const apiMessages = [
                { role: 'system', content: systemInstruction },
                ...newMessages.map(msg => ({
                    role: msg.role === 'model' ? 'assistant' : 'user',
                    content: msg.text
                }))
            ];
            
            const response = await fetch(process.env.LIGHTLLM_API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.LIGHTLLM_API_KEY || ''}`
                },
                body: JSON.stringify({
                    model: 'light-llm-model', // Using a placeholder model name
                    messages: apiMessages,
                }),
            });

            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`API request failed with status ${response.status}: ${errorBody}`);
            }

            const data = await response.json();
            
            const modelReply = data.choices?.[0]?.message?.content;
            if (!modelReply) {
                throw new Error("Invalid response structure from API.");
            }

            const modelMessage: Message = { role: 'model', text: modelReply.trim() };
            setMessages(prev => [...prev, modelMessage]);
        } catch (e: any) {
            console.error("Error sending message to LightLLM API:", e);
            const errorMessage: Message = { role: 'model', text: "Sorry, I encountered an error. Please try again." };
            setMessages(prev => [...prev, errorMessage]);
            setError("Failed to get a response from the AI.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const isConfigured = !!process.env.LIGHTLLM_API_ENDPOINT;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in">
            <div className="max-w-lg w-full h-full flex flex-col p-4">
                <Card className="flex-1 flex flex-col p-0 overflow-hidden animate-slide-in-up">
                    <header className="flex items-center justify-between p-4 border-b border-slate-200/50 dark:border-slate-700/50 flex-shrink-0">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 text-indigo-500">{ICONS.sparkles}</div>
                            <h2 className="text-lg font-bold">AI Assistant</h2>
                        </div>
                        <button onClick={onClose} className="p-2 -mr-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-full transition-colors text-2xl leading-none">&times;</button>
                    </header>

                    <div className="flex-1 p-4 overflow-y-auto space-y-4">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.role === 'model' && <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 flex items-center justify-center text-indigo-500 dark:text-indigo-400 flex-shrink-0">{ICONS.sparkles}</div>}
                                <div className={`max-w-xs md:max-w-md px-4 py-2.5 rounded-2xl ${msg.role === 'user' ? 'bg-indigo-500 text-white rounded-br-lg' : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-lg'}`}>
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex items-end gap-2 justify-start">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 flex items-center justify-center text-indigo-500 dark:text-indigo-400 flex-shrink-0">{ICONS.sparkles}</div>
                                <div className="px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 rounded-bl-lg">
                                    <TypingIndicator />
                                </div>
                            </div>
                        )}
                         <div ref={messagesEndRef} />
                    </div>

                    {error && <p className="text-center text-xs text-red-500 px-4 pb-2">{error}</p>}

                    <footer className="p-4 border-t border-slate-200/50 dark:border-slate-700/50 flex-shrink-0">
                        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder={isConfigured ? "Ask anything..." : "Chatbot not configured"}
                                className="w-full pl-4 pr-4 py-2.5 border-0 rounded-xl bg-slate-100 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                disabled={!isConfigured || isLoading}
                            />
                            <button
                                type="submit"
                                disabled={!isConfigured || isLoading || !input.trim()}
                                className="w-10 h-10 flex-shrink-0 bg-indigo-500 text-white rounded-full flex items-center justify-center transition-all hover:bg-indigo-600 disabled:bg-indigo-300 dark:disabled:bg-indigo-800 disabled:cursor-not-allowed"
                                aria-label="Send message"
                            >
                               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                            </button>
                        </form>
                    </footer>
                </Card>
            </div>
        </div>
    );
};

export default Chatbot;