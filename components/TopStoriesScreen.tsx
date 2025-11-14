import React, { useState } from 'react';
import { ProcessedTopStory } from '../types';
import Header from './common/Header';
import Card from './common/Card';
import ContentDetail from './common/ContentDetail';

interface TopStoriesScreenProps {
    stories: ProcessedTopStory[];
    onBack: () => void;
}

const TopStoriesScreen: React.FC<TopStoriesScreenProps> = ({ stories, onBack }) => {
    const [selectedStory, setSelectedStory] = useState<ProcessedTopStory | null>(null);

    if (selectedStory) {
        return <ContentDetail content={selectedStory} onBack={() => setSelectedStory(null)} />;
    }

    return (
        <div className="space-y-4 animate-fade-in">
            <Header title="Top Stories" onBack={onBack} />
            <div className="space-y-4">
                {stories.length > 0 ? (
                    stories.map(story => (
                        <div key={story.id} onClick={() => setSelectedStory(story)} className="cursor-pointer">
                            <Card className="flex items-center p-3 transition-shadow hover:shadow-md">
                                <img src={story.imageUrl} alt={story.title} className="w-20 h-20 rounded-lg object-cover mr-4" />
                                <div>
                                    <h3 className="font-semibold text-slate-800 dark:text-slate-200">{story.title}</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">{story.summary}</p>
                                </div>
                            </Card>
                        </div>
                    ))
                ) : (
                    <Card className="p-4 text-center text-slate-500 dark:text-slate-400">
                        <p>No stories available.</p>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default TopStoriesScreen;