
import React, { useState, useEffect, useMemo } from 'react';
import Header from './common/Header';
import Card from './common/Card';
import { ICONS } from '../constants';
import { AgendaSession, BookmarkType, Poll } from '../types';
import { useBookmarkContext } from '../contexts/BookmarkContext';

// Helper to create dates relative to "now" for demonstration
const getRelativeTime = (offsetMinutes: number) => {
    const d = new Date();
    d.setMinutes(d.getMinutes() + offsetMinutes);
    return d;
};

// Mock Data Generators
const generateMockAgenda = (): AgendaSession[] => [
    {
        id: '1',
        title: 'Opening Keynote: Future of Small Business',
        description: 'Join the NASA Administrator for a vision of the future.',
        startTime: getRelativeTime(-45),
        endTime: getRelativeTime(-15),
        location: 'Main Auditorium',
        track: 'Main Stage',
        speakers: [{ id: 's1', name: 'Dr. Sarah Smith', role: 'Administrator', avatar: '' }],
    },
    {
        id: '2',
        title: 'Navigating Federal Procurement',
        description: 'A deep dive into the 2025 procurement landscape and strategies for success.',
        startTime: getRelativeTime(-10),
        endTime: getRelativeTime(35),
        location: 'Hall B',
        track: 'Workshop',
        speakers: [{ id: 's2', name: 'John Doe', role: 'Procurement Officer', avatar: '' }],
        isLive: true
    },
    {
        id: '3',
        title: 'Networking & Coffee Break',
        description: 'Meet with small business specialists and network with peers.',
        startTime: getRelativeTime(40),
        endTime: getRelativeTime(60),
        location: 'Lobby',
        track: 'Networking',
        speakers: [],
    },
    {
        id: '4',
        title: 'Cybersecurity Requirements 101',
        description: 'Understanding CMMC 2.0 and what it means for your contracts.',
        startTime: getRelativeTime(65),
        endTime: getRelativeTime(110),
        location: 'Room 204',
        track: 'Workshop',
        speakers: [{ id: 's3', name: 'Alicia Keys', role: 'IT Security Lead', avatar: '' }],
    },
    {
        id: '5',
        title: 'Closing Remarks',
        description: 'Wrap up and next steps.',
        startTime: getRelativeTime(120),
        endTime: getRelativeTime(150),
        location: 'Main Auditorium',
        track: 'Main Stage',
        speakers: [],
    }
];

const mockPoll: Poll = {
    id: 'poll1',
    question: "What is your biggest barrier to entry?",
    options: [
        { id: 'opt1', text: 'Complex Requirements', votes: 12 },
        { id: 'opt2', text: 'Finding Opportunities', votes: 8 },
        { id: 'opt3', text: 'Past Performance', votes: 24 },
        { id: 'opt4', text: 'Security Clearance', votes: 5 }
    ],
    isActive: true,
    totalVotes: 49
};

const TabButton: React.FC<{ label: string; active: boolean; onClick: () => void }> = ({ label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`flex-1 py-2 text-sm font-semibold rounded-full transition-all ${
            active 
            ? 'bg-indigo-500 text-white shadow-md' 
            : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
        }`}
    >
        {label}
    </button>
);

const EventGuideScreen: React.FC = () => {
    const { isBookmarked, addBookmark, removeBookmark } = useBookmarkContext();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [activeTab, setActiveTab] = useState<'agenda' | 'my_schedule' | 'live'>('agenda');
    const [sessions, setSessions] = useState<AgendaSession[]>([]);
    const [poll, setPoll] = useState<Poll>(mockPoll);
    const [userVoted, setUserVoted] = useState<string | null>(null);
    const [announcement, setAnnouncement] = useState<string | null>(null);
    const [showAdmin, setShowAdmin] = useState(false);

    // Initialize mock data on mount
    useEffect(() => {
        setSessions(generateMockAgenda());
    }, []);

    // Update clock every minute
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    const toggleBookmark = (id: string) => {
        if (isBookmarked(id, BookmarkType.Session)) {
            removeBookmark(id, BookmarkType.Session);
        } else {
            addBookmark(id, BookmarkType.Session);
        }
    };

    const handleVote = (optionId: string) => {
        if (userVoted) return;
        setUserVoted(optionId);
        setPoll(prev => ({
            ...prev,
            totalVotes: prev.totalVotes + 1,
            options: prev.options.map(opt => 
                opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
            )
        }));
    };

    // Admin Actions
    const pushDelay = () => {
        setSessions(prev => prev.map(s => ({
            ...s,
            startTime: new Date(s.startTime.getTime() + 15 * 60000),
            endTime: new Date(s.endTime.getTime() + 15 * 60000)
        })));
        setAnnouncement("Schedule Update: All sessions delayed by 15 mins.");
        setTimeout(() => setAnnouncement(null), 5000);
    };

    const pushAnnouncement = () => {
        setAnnouncement("Reminder: Networking lunch starts in 10 minutes in the Lobby.");
        setTimeout(() => setAnnouncement(null), 8000);
    };

    // Derived State
    const currentSession = sessions.find(s => currentTime >= s.startTime && currentTime <= s.endTime);
    const mySchedule = sessions.filter(s => isBookmarked(s.id, BookmarkType.Session));
    
    // Determine which list to show
    const displaySessions = activeTab === 'my_schedule' ? mySchedule : sessions;

    const renderSessionCard = (session: AgendaSession) => {
        const isCurrent = currentTime >= session.startTime && currentTime <= session.endTime;
        const isPast = currentTime > session.endTime;
        const booked = isBookmarked(session.id, BookmarkType.Session);

        return (
            <div key={session.id} className={`flex relative pl-4 pb-8 ${isPast ? 'opacity-60 grayscale' : ''}`}>
                {/* Timeline Line */}
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700"></div>
                
                {/* Timeline Dot */}
                <div className={`absolute left-[-5px] top-2 w-3 h-3 rounded-full border-2 border-white dark:border-slate-900 ${
                    isCurrent ? 'bg-red-500 animate-pulse' : isPast ? 'bg-slate-400' : 'bg-indigo-500'
                }`}></div>

                <div className="flex-1 ml-4">
                    <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 mb-1">
                        <span className="font-mono">{session.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        <span className="mx-2">-</span>
                        <span className="font-mono">{session.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    
                    <Card className={`p-4 transition-all ${isCurrent ? 'ring-2 ring-indigo-500 shadow-xl' : ''}`}>
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="flex items-center space-x-2 mb-1">
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                        session.track === 'Main Stage' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' :
                                        session.track === 'Workshop' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                                        'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                                    }`}>
                                        {session.track}
                                    </span>
                                    {isCurrent && (
                                        <span className="flex items-center text-xs font-bold text-red-500 animate-pulse">
                                            <span className="w-2 h-2 rounded-full bg-red-500 mr-1"></span> LIVE
                                        </span>
                                    )}
                                </div>
                                <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">{session.title}</h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{session.description}</p>
                                
                                {session.speakers.length > 0 && (
                                    <div className="flex items-center mt-3">
                                        <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-xs font-bold text-indigo-700 dark:text-indigo-300 mr-2">
                                            {session.speakers[0].name.charAt(0)}
                                        </div>
                                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{session.speakers[0].name}, {session.speakers[0].role}</p>
                                    </div>
                                )}
                                
                                <div className="flex items-center mt-3 text-xs text-slate-400">
                                    {ICONS.mapPin}
                                    <span className="ml-1">{session.location}</span>
                                </div>
                            </div>
                            
                            <button 
                                onClick={() => toggleBookmark(session.id)}
                                className={`p-2 rounded-full transition-colors ${booked ? 'text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                            >
                                {booked ? ICONS.bookmark : ICONS.bookmarkOutline}
                            </button>
                        </div>
                    </Card>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-4 pb-20 relative min-h-screen">
             {/* Admin Toggle (Hidden in production, visible for demo) */}
             <button 
                onClick={() => setShowAdmin(!showAdmin)}
                className="fixed top-20 right-4 z-50 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-50 hover:opacity-100"
            >
                {showAdmin ? 'Hide Admin' : 'Admin'}
            </button>

            {/* Announcement Banner */}
            {announcement && (
                <div className="fixed top-16 left-0 right-0 z-40 bg-indigo-600 text-white px-4 py-3 shadow-lg animate-slide-in-up flex items-center justify-center">
                    <div className="mr-2">{ICONS.bell}</div>
                    <p className="font-medium text-sm">{announcement}</p>
                </div>
            )}

            <Header title="Event Guide" />

            {/* Admin Panel */}
            {showAdmin && (
                <Card className="mb-4 bg-slate-800 text-slate-200 border-none">
                    <h3 className="text-xs font-bold uppercase tracking-wider mb-2 text-slate-400">Organizer Controls</h3>
                    <div className="flex space-x-2">
                        <button onClick={pushDelay} className="px-3 py-1 bg-red-500/20 text-red-400 rounded text-xs hover:bg-red-500/40">Delay +15m</button>
                        <button onClick={pushAnnouncement} className="px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded text-xs hover:bg-indigo-500/40">Push Alert</button>
                    </div>
                </Card>
            )}

            {/* Navigation Tabs */}
            <div className="flex space-x-2 p-1 bg-slate-200 dark:bg-slate-800/50 rounded-full mb-6">
                <TabButton label="Agenda" active={activeTab === 'agenda'} onClick={() => setActiveTab('agenda')} />
                <TabButton label="My Schedule" active={activeTab === 'my_schedule'} onClick={() => setActiveTab('my_schedule')} />
                <TabButton label="Live Now" active={activeTab === 'live'} onClick={() => setActiveTab('live')} />
            </div>

            {/* LIVE TAB CONTENT */}
            {activeTab === 'live' && (
                <div className="animate-fade-in space-y-6">
                    {currentSession ? (
                        <>
                            <div className="text-center">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-600 animate-pulse mb-2">
                                    <span className="w-2 h-2 bg-red-600 rounded-full mr-2"></span> HAPPENING NOW
                                </span>
                                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{currentSession.title}</h2>
                                <p className="text-slate-500 dark:text-slate-400 mt-1">{currentSession.location}</p>
                            </div>

                            {/* Main Live Card */}
                            <Card className="p-0 overflow-hidden border-indigo-500 border-2 shadow-2xl shadow-indigo-500/20">
                                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 text-white">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center space-x-2">
                                            {ICONS.microphone}
                                            <span className="font-bold">Live Stage</span>
                                        </div>
                                        <span className="text-xs bg-white/20 px-2 py-1 rounded">
                                            Ending {currentSession.endTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="font-bold text-lg mb-2">Interactive Poll</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{poll.question}</p>
                                    
                                    <div className="space-y-3">
                                        {poll.options.map(opt => {
                                            const percentage = poll.totalVotes > 0 ? Math.round((opt.votes / poll.totalVotes) * 100) : 0;
                                            const isSelected = userVoted === opt.id;
                                            
                                            return (
                                                <button 
                                                    key={opt.id}
                                                    disabled={!!userVoted}
                                                    onClick={() => handleVote(opt.id)}
                                                    className="w-full relative h-10 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition-all disabled:cursor-default"
                                                >
                                                    {/* Progress Bar */}
                                                    <div 
                                                        className={`absolute top-0 left-0 bottom-0 transition-all duration-1000 ${isSelected ? 'bg-indigo-500/30' : 'bg-slate-300/30 dark:bg-slate-600/30'}`}
                                                        style={{ width: userVoted ? `${percentage}%` : '0%' }}
                                                    ></div>
                                                    
                                                    <div className="absolute inset-0 flex items-center justify-between px-4 z-10">
                                                        <span className={`text-sm font-medium ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : ''}`}>{opt.text}</span>
                                                        {userVoted && <span className="text-xs font-bold">{percentage}%</span>}
                                                    </div>
                                                </button>
                                            )
                                        })}
                                    </div>
                                    <p className="text-xs text-center text-slate-400 mt-4">{poll.totalVotes} votes cast • Live results</p>
                                </div>
                            </Card>

                            <div className="grid grid-cols-2 gap-4">
                                <button className="p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm flex flex-col items-center justify-center space-y-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                                    <div className="text-indigo-500">{ICONS.chat}</div>
                                    <span className="text-sm font-bold">Ask Question</span>
                                </button>
                                <button className="p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm flex flex-col items-center justify-center space-y-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                                    <div className="text-indigo-500">{ICONS.share}</div>
                                    <span className="text-sm font-bold">Share Event</span>
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                                {ICONS.clock}
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">No Active Sessions</h3>
                            <p className="text-slate-500">Check the agenda for upcoming events.</p>
                            <button onClick={() => setActiveTab('agenda')} className="mt-4 text-indigo-500 font-semibold hover:underline">View Full Agenda</button>
                        </div>
                    )}
                </div>
            )}

            {/* AGENDA & MY SCHEDULE TAB CONTENT */}
            {(activeTab === 'agenda' || activeTab === 'my_schedule') && (
                <div className="animate-slide-in-up space-y-2">
                    {displaySessions.length > 0 ? (
                        displaySessions.map(renderSessionCard)
                    ) : (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                                {activeTab === 'my_schedule' ? ICONS.bookmark : ICONS.events}
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
                                {activeTab === 'my_schedule' ? "Your Schedule is Empty" : "No Sessions Found"}
                            </h3>
                            <p className="text-slate-500">
                                {activeTab === 'my_schedule' ? "Bookmark sessions from the Agenda to see them here." : "There are no sessions to display."}
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default EventGuideScreen;
