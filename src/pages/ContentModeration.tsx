import React, { useState, useEffect, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import { getFlaggedStories } from '@/lib/firestoreUtils'; // Import the function
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table'; // Import DataTable
import { flaggedStoryColumns } from '@/components/moderation/columns'; // Import columns
import { Story } from '@/types'; // Import Story type

const ContentModeration = () => {
  const [flaggedStories, setFlaggedStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFlaggedStories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const stories = await getFlaggedStories(); // Fetch flagged stories
      setFlaggedStories(stories);
    } catch (err: any) {
      console.error("Error fetching flagged content:", err);
      setError(err.message || 'Failed to load flagged content');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFlaggedStories();
  }, [fetchFlaggedStories]);

  return (
    <div className="space-y-6">
      <DashboardHeader 
        title="Content Moderation" 
        description="Review and manage flagged stories and other content." 
      />

      {loading && (
        <div className="flex justify-center items-center h-[40vh]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
            <p className="text-muted-foreground">Loading flagged content...</p>
          </div>
        </div>
      )}

      {error && (
        <Card className="bg-destructive/10 border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error Loading Data</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
            {error.includes('index required') && (
              <p className="mt-2 text-sm text-muted-foreground">
                Please ensure you have created the necessary Firestore index for the 'stories' collection group, filtering by 'status' and ordered by 'createdAt' descending.
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {!loading && !error && (
        <Card>
          <CardHeader>
            <CardTitle>Flagged Stories ({flaggedStories.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Pass fetchFlaggedStories to columns for refresh capability */}
            <DataTable columns={flaggedStoryColumns(fetchFlaggedStories)} data={flaggedStories} />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ContentModeration;

