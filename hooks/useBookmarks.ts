import { useState, useEffect, useCallback } from 'react';
import { Bookmark, BookmarkType } from '../types';

const BOOKMARKS_STORAGE_KEY = 'app_bookmarks';

const loadBookmarksFromStorage = (): Bookmark[] => {
    try {
        const storedData = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
        if (storedData) {
            const parsedData = JSON.parse(storedData);
            // Validate that the parsed data is an array of valid bookmarks
            if (Array.isArray(parsedData) && parsedData.every(item =>
                typeof item === 'object' && item !== null &&
                typeof item.id === 'string' &&
                Object.values(BookmarkType).includes(item.type as BookmarkType)
            )) {
                return parsedData as Bookmark[];
            }
        }
    } catch (error) {
        console.error('Error loading or validating bookmarks from storage:', error);
    }
    return [];
};


export const useBookmarks = () => {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>(loadBookmarksFromStorage);

    useEffect(() => {
        try {
            localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(bookmarks));
        } catch (error) {
            console.error("Failed to save bookmarks to localStorage", error);
        }
    }, [bookmarks]);
    
    const addBookmark = useCallback((id: string, type: BookmarkType) => {
        if (!id) return;
        setBookmarks(prevBookmarks => {
            if (prevBookmarks.some(b => b.id === id && b.type === type)) {
                return prevBookmarks;
            }
            return [...prevBookmarks, { id, type }];
        });
    }, []);

    const removeBookmark = useCallback((id: string, type: BookmarkType) => {
        if (!id) return;
        setBookmarks(prevBookmarks => 
            prevBookmarks.filter(b => !(b.id === id && b.type === type))
        );
    }, []);

    const isBookmarked = useCallback((id: string, type: BookmarkType): boolean => {
        if (!id) return false;
        return bookmarks.some(b => b.id === id && b.type === type);
    }, [bookmarks]);

    return { bookmarks, addBookmark, removeBookmark, isBookmarked };
};