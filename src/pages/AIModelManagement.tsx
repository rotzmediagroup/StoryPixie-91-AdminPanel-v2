import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { getAllAIModels } from '@/lib/firestoreUtils'; // Import the function to get models
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table'; // Import the DataTable component
import { aiModelColumns } from '@/components/ai-models/columns'; // Import the AI model column definitions
import { AIModel } from '@/types'; // Import the AIModel type
// TODO: Import Add/Edit Model Dialog component

const AIModelManagement = () => {
  const [models, setModels] = useState<AIModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // TODO: Add state for managing Add/Edit dialog

  const fetchModels = async () => {
    setLoading(true);
    setError(null);
    try {
      const allModels = await getAllAIModels(); // Fetch models
      setModels(allModels);
    } catch (err: any) {
      console.error("Error fetching AI model data:", err);
      setError(err.message || 'Failed to load AI model data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  // TODO: Implement functions to handle add, edit, delete, toggle status

  return (
    <div className="space-y-6">
      <DashboardHeader 
        title="AI Model Management" 
        description="Configure and manage AI models for story generation." 
      />

      {loading && (
        <div className="flex justify-center items-center h-[40vh]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
            <p className="text-muted-foreground">Loading AI model data...</p>
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
          </CardContent>
        </Card>
      )}

      {!loading && !error && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Configured Models ({models.length})</CardTitle>
            <Button size="sm" onClick={() => alert('Add New Model (Not Implemented)')}>Add New Model</Button> {/* TODO: Open Add Model dialog */}
          </CardHeader>
          <CardContent>
            <DataTable columns={aiModelColumns} data={models} />
          </CardContent>
        </Card>
      )}

      {/* TODO: Add/Edit Model Dialog Component */}
    </div>
  );
};

export default AIModelManagement;

