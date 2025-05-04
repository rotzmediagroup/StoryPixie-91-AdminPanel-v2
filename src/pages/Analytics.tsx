import React, { useState, useEffect } from \'react\';
import DashboardHeader from \'@/components/dashboard/DashboardHeader\';
import { Card, CardContent, CardHeader, CardTitle } from \'@/components/ui/card\';
import SimpleLineChart from \'@/components/analytics/SimpleLineChart\'; // Import the chart component
import { getDailyUserSignups, getDailyStoryGenerations } from \'@/lib/firestoreUtils\'; // Import data fetching functions
import { Loader2 } from \'lucide-react\';

interface TimeSeriesData {
  date: string;
  count: number;
}

const Analytics = () => {
  const [userSignupData, setUserSignupData] = useState<TimeSeriesData[]>([]);
  const [storyGenerationData, setStoryGenerationData] = useState<TimeSeriesData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const daysToFetch = 30; // Fetch data for the last 30 days

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch data in parallel
        const [signupData, generationData] = await Promise.all([
          getDailyUserSignups(daysToFetch),
          getDailyStoryGenerations(daysToFetch),
          // TODO: Fetch data for other reports (e.g., popular themes)
        ]);

        setUserSignupData(signupData);
        setStoryGenerationData(generationData);

      } catch (err: any) {
        console.error(\"Error fetching analytics data:\", err);
        setError(err.message || \'Failed to load analytics data\
        // Check for Firestore index errors specifically
        if (err.message.includes(\'index required\') || err.message.includes(\'indexes\')) {
          setError(
            \'Failed to load analytics data due to missing Firestore indexes. Please ensure indexes are created for \'users\' (createdAt) and \'stories\' (createdAt, collection group) as needed for analytics queries.\'
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [daysToFetch]);

  return (
    <div className=\"space-y-6\">
      <DashboardHeader 
        title=\"Analytics & Reporting\" 
        description=\"Gain deeper insights into application usage and trends.\" 
      />

      {loading && (
        <div className=\"flex justify-center items-center h-[40vh]\">
          <div className=\"text-center\">
            <Loader2 className=\"h-8 w-8 animate-spin text-primary mx-auto mb-2\" />
            <p className=\"text-muted-foreground\">Loading analytics data...</p>
          </div>
        </div>
      )}

      {error && (
        <Card className=\"bg-destructive/10 border-destructive\">
          <CardHeader>
            <CardTitle className=\"text-destructive\">Error Loading Data</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
        </Card>
      )}

      {!loading && !error && (
        <div className=\"grid gap-6 md:grid-cols-1 lg:grid-cols-2\"> {/* Adjusted grid layout */}
          {/* User Growth Trend Chart */}
          <SimpleLineChart 
            data={userSignupData} 
            title={`User Growth Trend (Last ${daysToFetch} Days)`} 
            lineKey=\"Signups\" 
            lineColor=\"#8884d8\" 
          />

          {/* Story Generation Volume Chart */}
          <SimpleLineChart 
            data={storyGenerationData} 
            title={`Story Generation Volume (Last ${daysToFetch} Days)`} 
            lineKey=\"Stories Generated\" 
            lineColor=\"#82ca9d\" 
          />

          {/* Placeholder for Popular Themes */}
          <Card>
            <CardHeader>
              <CardTitle>Popular Themes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className=\"text-muted-foreground\">Table or chart showing most used story themes will be here.</p>
              {/* TODO: Implement Popular Themes Component/Data Fetching */}
            </CardContent>
          </Card>

          {/* Add more report cards/charts as needed */}
        </div>
      )}
    </div>
  );
};

export default Analytics;

