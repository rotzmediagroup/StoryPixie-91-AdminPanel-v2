
import { useState, useEffect } from 'react';
import { collection, query, getDocs, where, orderBy, limit, DocumentData, QueryConstraint } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface Story {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  userEmail?: string;
  theme?: string;
  characters?: string[];
  ageRange?: string;
  imageUrl?: string;
  audioUrl?: string;
  views: number;
  completions: number;
  avgRating: number;
  status: 'draft' | 'published' | 'archived' | 'flagged';
}

interface UseStoriesOptions {
  limitCount?: number;
  orderByField?: string;
  orderDirection?: 'asc' | 'desc';
  filterByStatus?: string;
  filterByTheme?: string;
  userId?: string;
  searchQuery?: string;
}

export function useStories({
  limitCount = 20,
  orderByField = 'createdAt',
  orderDirection = 'desc',
  filterByStatus,
  filterByTheme,
  userId,
  searchQuery,
}: UseStoriesOptions = {}) {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchStories = async () => {
      setLoading(true);
      setError(null);
      try {
        const storiesRef = collection(db, 'stories');
        const constraints: QueryConstraint[] = [];
        
        // Add ordering
        constraints.push(orderBy(orderByField, orderDirection));
        
        // Add filters if specified
        if (filterByStatus) {
          constraints.push(where('status', '==', filterByStatus));
        }
        
        if (filterByTheme) {
          constraints.push(where('theme', '==', filterByTheme));
        }
        
        if (userId) {
          constraints.push(where('userId', '==', userId));
        }
        
        // Add limit
        constraints.push(limit(limitCount));
        
        const storyQuery = query(storiesRef, ...constraints);
        const querySnapshot = await getDocs(storyQuery);
        
        // Get total count (this is a simple approach, for large collections you'd use a counter document)
        setTotalCount(querySnapshot.size);
        
        // Process results
        let results: Story[] = [];
        querySnapshot.forEach((doc) => {
          const storyData = doc.data() as DocumentData;
          results.push({
            id: doc.id,
            title: storyData.title || 'Untitled Story',
            content: storyData.content || '',
            createdAt: storyData.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
            updatedAt: storyData.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
            userId: storyData.userId || '',
            userEmail: storyData.userEmail || '',
            theme: storyData.theme || '',
            characters: storyData.characters || [],
            ageRange: storyData.ageRange || '',
            imageUrl: storyData.imageUrl || '',
            audioUrl: storyData.audioUrl || '',
            views: storyData.views || 0,
            completions: storyData.completions || 0,
            avgRating: storyData.avgRating || 0,
            status: storyData.status || 'published'
          });
        });
        
        // Filter by search query client-side
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          results = results.filter(story => 
            story.title.toLowerCase().includes(query) || 
            story.content.toLowerCase().includes(query)
          );
        }
        
        setStories(results);
      } catch (err) {
        console.error("Error fetching stories:", err);
        setError(`Failed to fetch stories: ${(err as Error).message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, [limitCount, orderByField, orderDirection, filterByStatus, filterByTheme, userId, searchQuery]);

  return { stories, loading, error, totalCount };
}
