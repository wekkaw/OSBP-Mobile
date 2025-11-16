import React, { useState, useEffect, useRef } from 'react';
import { ICONS } from '../constants';
import Card from './common/Card';
import { ProcessedData } from '../types';

interface Message {
    role: 'user' | 'model';
    text: string;
}

interface IndexedDocument {
    text: string;
    embedding: number[];
    metadata: {
        type: 'Contact' | 'Contract' | 'Event';
        id: string | number;
    };
}

interface ChatbotProps {
    onClose: () => void;
    data: ProcessedData | null;
}

type IndexingStatus = 'idle' | 'indexing' | 'ready' | 'error';

const TypingIndicator: React.FC = () => (
    <div className="flex items-center space-x-1.5">
        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
    </div>
);

// --- Vector Math Utility ---
const cosineSimilarity = (vecA: number[], vecB: number[]): number => {
    const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
    const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
    if (magnitudeA === 0 || magnitudeB === 0) return 0;
    return dotProduct / (magnitudeA * magnitudeB);
};

const Chatbot: React.FC<ChatbotProps> = ({ onClose, data }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [indexingStatus, setIndexingStatus] = useState<IndexingStatus>('idle');
    const [indexProgress, setIndexProgress] = useState(0);
    const indexedDocumentsRef = useRef<IndexedDocument[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    
    const isConfigured = !!process.env.LIGHTLLM_EMBEDDING_ENDPOINT && !!process.env.LIGHTLLM_API_ENDPOINT;

    // --- Embedding and Indexing Logic ---
    const getEmbedding = async (text: string): Promise<number[]> => {
        if (!process.env.LIGHTLLM_EMBEDDING_ENDPOINT) {
            throw new Error("Embedding endpoint is not configured.");
        }
        const response = await fetch(process.env.LIGHTLLM_EMBEDDING_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.LIGHTLLM_API_KEY || ''}`
            },
            body: JSON.stringify({
                input: [text],
                model: 'embedding-model-placeholder' // Model name might be required
            }),
        });

        if (!response.ok) {
            throw new Error(`Embedding API request failed: ${response.statusText}`);
        }
        const responseData = await response.json();
        if (!responseData.data || !responseData.data[0] || !responseData.data[0].embedding) {
            throw new Error("Invalid embedding response structure.");
        }
        return responseData.data[0].embedding;
    };

    const buildIndex = async () => {
        if (!data || !isConfigured) return;
        setIndexingStatus('indexing');
        const documentsToIndex = [];

        // 1. Collate documents
        data.processedContacts.forEach(c => documentsToIndex.push({ text: `Contact: ${c.name}, ${c.title} at ${c.center}. Position: ${c.position}.`, metadata: { type: 'Contact', id: c.id } }));
        data.processedContracts.forEach(c => documentsToIndex.push({ text: `Contract: ${c.contract_name} with ${c.contractor_name}. Value: ${c.potential_value}. Ends on ${c.ultimate_contract_end_date}.`, metadata: { type: 'Contract', id: c.id } }));
        data.events.forEach(e => documentsToIndex.push({ text: `Event: ${e.title} at ${e.location} on ${e.date}. Description: ${e.description}`, metadata: { type: 'Event', id: e.id } }));
        
        const totalDocs = documentsToIndex.length;
        if (totalDocs === 0) {
            setIndexingStatus('ready');
            return;
        }

        // 2. Create embeddings for each document
        const newIndexedDocs: IndexedDocument[] = [];
        for (let i = 0; i < totalDocs; i++) {
            const doc = documentsToIndex[i];
            try {
                const embedding = await getEmbedding(doc.text);
                newIndexedDocs.push({ ...doc, embedding });
                setIndexProgress(((i + 1) / totalDocs) * 100);
            } catch (err) {
                console.error("Failed to embed document:", doc.text, err);
                // Skip faulty documents
            }
        }
        indexedDocumentsRef.current = newIndexedDocs;
        setIndexingStatus('ready');
    };
    
    // --- Context Retrieval ---
    const retrieveContext = async (query: string, topK = 5): Promise<string> => {
        if (indexingStatus !== 'ready' || indexedDocumentsRef.current.length === 0) {
             return "The local data index is not ready. Please wait.";
        }
        try {
            const queryEmbedding = await getEmbedding(query);
            const similarities = indexedDocumentsRef.current.map(doc => ({
                ...doc,
                similarity: cosineSimilarity(queryEmbedding, doc.embedding),
            }));

            similarities.sort((a, b) => b.similarity - a.similarity);

            const topResults = similarities.slice(0, topK);
            
            if (topResults.length === 0 || topResults[0].similarity < 0.3) { // Similarity threshold
                return "No relevant information found in the local data for this query.";
            }

            return topResults.map(r => r.text).join('\n\n');
        } catch(err) {
             console.error("Error during context retrieval:", err);
             return "An error occurred while searching for relevant information.";
        }
    };


    // --- Component Lifecycle & Effects ---
    useEffect(() => {
        if (!isConfigured) {
            setError("Chatbot is not configured. Please provide your LightLLM API and embedding endpoints.");
            setIndexingStatus('error');
        } else {
            setMessages([{ role: 'model', text: "Hello! How can I help you today?" }]);
            buildIndex();
        }
    }, [isConfigured, data]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);


    // --- User Interaction ---
    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading || indexingStatus !== 'ready') return;

        const userMessage: Message = { role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
        setError(null);
        
        const context = await retrieveContext(input);

        const systemInstruction = `You are an expert assistant for a "Small Business Opportunities" dashboard.
Answer the user's question based ONLY on the following information provided in the [AVAILABLE DATA] section. Do not use any external knowledge.
If the information to answer the question is not in the provided data, you MUST say that you cannot find the answer in the application's data.

[AVAILABLE DATA]
${context}
[END OF DATA]

Keep your answers concise and professional.`;

        try {
            if (!process.env.LIGHTLLM_API_ENDPOINT) {
                throw new Error("Chatbot API endpoint is not configured.");
            }

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
                        { role: 'user', content: userMessage.text }
                    ]
                })
            });

            if (!response.ok) {
                throw new Error(`API responded with status: ${response.status}`);
            }

            const data = await response.json();
            const modelReply = data.choices?.[0]?.message?.content;

            if (!modelReply) throw new Error("Empty response from API.");

            setMessages(prev => [...prev, { role: 'model', text: modelReply.trim() }]);
        } catch (e: any) {
            console.error("Error sending message to API:", e);
            setMessages(prev => [...prev, { role: 'model', text: "Sorry, I encountered an error. Please try again." }]);
            setError("Failed to get a response from the AI.");
        } finally {
            setIsLoading(false);
        }
    };
    
    // --- Render Logic ---
    const renderIndexingStatus = () => {
        switch (indexingStatus) {
            case 'indexing':
                return (
                    <div className="text-center text-xs text-slate-500 px-4 pb-2">
                        <p>Preparing smart search...</p>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 mt-1">
                            <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${indexProgress}%` }}></div>
                        </div>
                    </div>
                );
            case 'ready':
                return <p className="text-center text-xs text-green-600 dark:text-green-400 px-4 pb-2">Ready to assist!</p>;
            case 'error':
                 return <p className="text-center text-xs text-red-500 px-4 pb-2">{error}</p>
            default:
                return null;
        }
    };

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

                    {renderIndexingStatus()}

                    <footer className="p-4 border-t border-slate-200/50 dark:border-slate-700/50 flex-shrink-0">
                        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder={indexingStatus === 'ready' ? "Ask about contracts, contacts..." : "Assistant is getting ready..."}
                                className="w-full pl-4 pr-4 py-2.5 border-0 rounded-xl bg-slate-100 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                disabled={!isConfigured || isLoading || indexingStatus !== 'ready'}
                            />
                            <button
                                type="submit"
                                disabled={!isConfigured || isLoading || !input.trim() || indexingStatus !== 'ready'}
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