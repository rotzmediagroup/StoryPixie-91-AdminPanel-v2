import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { getAllStories } from '@/lib/firestoreUtils'; // Import the function to get stories
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table'; // Import the DataTable component
import { storyColumns } from '@/components/stories/columns'; // Import the story column definitions
import { Story } from '@/types'; // Import the Story type

const StoryManagement = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const allStories = await getAllStories(); // Fetch stories
        setStories(allStories);
      } catch (err: any) {
        console.error("Error fetching story data:", err);
        setError(err.message || 'Failed to load story data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <DashboardHeader 
        title="Story Management" 
        description="View, search, filter, and manage all generated stories." 
      />

      {loading && (
        <div className="flex justify-center items-center h-[40vh]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
            <p className="text-muted-foreground">Loading story data...</p>
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
              <p className="text-sm text-muted-foreground mt-2">
                Please ensure the required Firestore collection group index for 'stories' (ordered by createdAt descending) is created and active.
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {!loading && !error && (
        <Card>
          <CardHeader>
            <CardTitle>All Stories ({stories.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable columns={storyColumns} data={stories} />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StoryManagement;

