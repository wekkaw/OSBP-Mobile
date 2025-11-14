import React from 'react';
import Header from './Header';

interface ContentDetailProps {
    content: {
        title: string;
        body: string;
        imageUrl?: string;
    };
    onBack: () => void;
}

const ContentDetail: React.FC<ContentDetailProps> = ({ content, onBack }) => {
    return (
        <div className="animate-fade-in space-y-4">
            <Header title={content.title} onBack={onBack} />
            
            {content.imageUrl && (
                 <img src={content.imageUrl} alt={content.title} className="rounded-xl object-cover w-full h-48 -mt-6" />
            )}
           
            <div 
                className="content-view text-slate-700 dark:text-slate-300 px-1"
                dangerouslySetInnerHTML={{ __html: content.body }} 
            />
        </div>
    );
};

export default ContentDetail;