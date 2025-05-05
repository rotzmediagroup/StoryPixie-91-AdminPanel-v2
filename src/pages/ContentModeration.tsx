import React, { useState, useEffect, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import { getFlaggedStories } from '@/lib/firestoreUtils'; // Import the function
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table'; // Import DataTable
import { flaggedStoryColumns } from '@/components/moderation/columns'; // Import columns
import { Story } from '@/types'; // Import Story type
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Import Alert components
import { Terminal } from "lucide-react"; // Import an icon for the alert

const ContentModeration = () => {
  const [flaggedStories, setFlaggedStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFlaggedStories = useCallback(async () => {
    console.log('[fetchFlaggedStories] Setting loading true...'); // Keep console logs
    setLoading(true);
    setError(null);
    try {
      console.log('[fetchFlaggedStories] Calling getFlaggedStories...');
      const stories = await getFlaggedStories(); // Fetch flagged stories
      console.log('[fetchFlaggedStories] getFlaggedStories returned:', stories);
      setFlaggedStories(stories);
    } catch (err: any) {
      console.error("[fetchFlaggedStories] Error fetching flagged content:", err);
      // Set the error state with a detailed message
      setError(`Failed to load flagged content: ${err.message || 'Unknown error'}. Code: ${err.code || 'N/A'}`);
    } finally {
      console.log('[fetchFlaggedStories] Setting loading false...');
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

      {/* Display Loading State */}
      {loading && (
        <div className="flex justify-center items-center h-[40vh]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
            <p className="text-muted-foreground">Loading flagged content...</p>
          </div>
        </div>
      )}

      {/* Display Error State Prominently */}
      {error && (
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error Loading Flagged Content</AlertTitle>
          <AlertDescription>
            <p>{error}</p>
            {/* Specific guidance for index errors */}
            {(error.includes('index required') || error.includes('indexes') || error.includes('FAILED_PRECONDITION')) && (
              <p className="mt-2 text-sm">
                This often indicates a missing Firestore index. Please ensure you have created the necessary composite index for the 'stories' collection group:
                <br />- Query Scope: Collection Group
                <br />- Collection ID: stories
                <br />- Fields: status (Ascending), createdAt (Descending)
                <br />You can usually create this index via a link provided in the Firebase Console error logs.
              </p>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Display Data Table when not loading and no error */}
      {!loading && !error && (
        <Card>
          <CardHeader>
            <CardTitle>Flagged Stories ({flaggedStories.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable columns={flaggedStoryColumns} data={flaggedStories} />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ContentModeration;

