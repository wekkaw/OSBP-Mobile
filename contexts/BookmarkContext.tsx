import React, { createContext, useContext, ReactNode } from 'react';
import { useBookmarks } from '../hooks/useBookmarks';
import { Bookmark, BookmarkType } from '../types';

interface BookmarkContextType {
    bookmarks: Bookmark[];
    addBookmark: (id: string, type: BookmarkType) => void;
    removeBookmark: (id: string, type: BookmarkType) => void;
    isBookmarked: (id: string, type: BookmarkType) => boolean;
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

export const BookmarkProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const bookmarkValue = useBookmarks();

    return (
        <BookmarkContext.Provider value={bookmarkValue}>
            {children}
        </BookmarkContext.Provider>
    );
};

export const useBookmarkContext = () => {
    const context = useContext(BookmarkContext);
    if (context === undefined) {
        throw new Error('useBookmarkContext must be used within a BookmarkProvider');
    }
    return context;
};