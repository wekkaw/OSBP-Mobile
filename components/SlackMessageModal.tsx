import React, { useState, useEffect } from 'react';
import { ProcessedContact } from '../types';
import Card from './common/Card';
import LoadingSpinner from './common/LoadingSpinner';
import { ICONS } from '../constants';

interface SlackMessageModalProps {
    contact: ProcessedContact;
    onClose: () => void;
}

const SlackMessageModal: React.FC<SlackMessageModalProps> = ({ contact, onClose }) => {
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const generateMessage = async () => {
            setIsLoading(true);
            setError(null);
            
            try {
                if (!process.env.LIGHTLLM_API_ENDPOINT) {
                    throw new Error("LightLLM API endpoint is not configured.");
                }

                const prompt = `Compose a professional and friendly Slack message to ${contact.name}, who is a ${contact.title} at ${contact.center}. The purpose is to initiate a conversation about potential business opportunities or collaborations. Keep it concise and engaging.`;
                const systemInstruction = 'You are a helpful assistant specialized in writing professional business communications.';

                const response = await fetch(process.env.LIGHTLLM_API_ENDPOINT, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${process.env.LIGHTLLM_API_KEY || ''}`
                    },
                    body: JSON.stringify({
                        model: 'gpt-3.5-turbo', // Or your preferred model
                        messages: [
                            { role: 'system', content: systemInstruction },
                            { role: 'user', content: prompt }
                        ],
                        max_tokens: 200,
                        temperature: 0.7
                    })
                });
                
                if (!response.ok) {
                    throw new Error(`API request failed: ${response.statusText}`);
                }

                const data = await response.json();
                const generatedText = data.choices?.[0]?.message?.content;

                if (!generatedText) {
                    throw new Error("Invalid response structure from API.");
                }
                
                setMessage(generatedText.trim());

            } catch (e) {
                console.error("Error generating message:", e);
                setError('Failed to generate AI message. Please write one manually or try again.');
                setMessage(`Hi ${contact.name}, I'd like to connect regarding potential business opportunities. Let me know when you're available for a brief chat.`);
            } finally {
                setIsLoading(false);
            }
        };

        generateMessage();
    }, [contact]);

    const handleSend = () => {
        setIsSending(true);
        // Simulate sending the message
        setTimeout(() => {
            setIsSending(false);
            setIsSent(true);
            setTimeout(() => {
                onClose();
            }, 2000);
        }, 1000);
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in" onClick={onClose}>
            <Card className="w-full max-w-md p-0 overflow-hidden" onClick={(e) => e.stopPropagation()}>
                <div className="p-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-xl font-bold">Slack Message</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400">To: {contact.name}</p>
                        </div>
                         <button onClick={onClose} className="p-1 -mr-2 -mt-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-2xl leading-none">&times;</button>
                    </div>

                    <div className="mt-4">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center h-48 bg-slate-100 dark:bg-slate-800/50 rounded-lg">
                                <LoadingSpinner />
                                <p className="text-sm text-slate-500 mt-2">Generating message with AI...</p>
                            </div>
                        ) : isSent ? (
                             <div className="flex flex-col items-center justify-center h-48 bg-green-50 dark:bg-green-900/50 rounded-lg text-green-700 dark:text-green-300">
                                <div className="w-12 h-12">{ICONS.sparkles}</div>
                                <p className="font-semibold mt-2">Message Sent!</p>
                            </div>
                        ) : (
                            <>
                                {error && <p className="text-sm text-red-500 bg-red-100 dark:bg-red-900/50 p-3 rounded-lg mb-3">{error}</p>}
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="w-full h-48 p-3 border-0 rounded-lg bg-slate-100 dark:bg-slate-800/80 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                    placeholder="Write your message..."
                                />
                            </>
                        )}
                    </div>
                </div>
                {!isSent && (
                     <div className="bg-slate-50/50 dark:bg-slate-900/20 px-6 py-4 flex justify-end">
                        <button
                            onClick={handleSend}
                            disabled={isLoading || isSending || !message}
                            className="px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-all flex items-center justify-center"
                        >
                            {isSending ? (
                                <>
                                 <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin mr-2"></div>
                                 <span>Sending...</span>
                                </>
                            ) : (
                                <span>Send Message</span>
                            )}
                        </button>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default SlackMessageModal;