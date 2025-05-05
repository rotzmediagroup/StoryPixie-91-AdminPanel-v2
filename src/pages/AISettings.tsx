import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
// Corrected import: Use saveAISettings instead of updateAISettings
import { getAISettings, saveAISettings, getAllAIModels } from '@/lib/firestoreUtils'; 
import { AISettings, AIModel } from '@/types';
import { Loader2, Save, AlertCircle } from 'lucide-react';

const AISettingsPage = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<Partial<AISettings>>({});
  const [models, setModels] = useState<AIModel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [fetchedSettings, fetchedModels] = await Promise.all([
          getAISettings(),
          getAllAIModels()
        ]);
        if (fetchedSettings) {
          setSettings(fetchedSettings);
        }
        setModels(fetchedModels.filter(m => m.active)); // Only show active models as options
      } catch (err) {
        console.error("Failed to load AI settings or models:", err);
        setError("Failed to load data. Please check console or try again later.");
        toast({
          title: "Error loading data",
          description: err instanceof Error ? err.message : "An unknown error occurred.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [toast]);

  const handleInputChange = (field: keyof AISettings, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    try {
      // Corrected function call: Use saveAISettings
      const success = await saveAISettings(settings); 
      if (success) {
        toast({
          title: "AI Settings Saved",
          description: "Your AI generation settings have been updated.",
        });
      } else {
        throw new Error("Failed to save settings. Please try again.");
      }
    } catch (err) {
      console.error("Failed to save AI settings:", err);
      setError("Failed to save settings. Please check console or try again later.");
      toast({
        title: "Error Saving Settings",
        description: err instanceof Error ? err.message : "An unknown error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-12 w-12 text-muted-foreground animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-500">
        <CardHeader>
          <CardTitle className="text-red-600 flex items-center">
            <AlertCircle className="mr-2" /> Error Loading Settings
          </CardTitle>
          <CardDescription className="text-red-500">{error}</CardDescription>
        </CardHeader>
        {/* Optionally add a retry button */}
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">AI Generation Settings</h1>
      <p className="text-muted-foreground">
        Configure the default models and prompts used for generating stories and sequels.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Model Configuration</CardTitle>
          <CardDescription>
            Select the default and fallback AI models for generation tasks.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Story Models */}
            <div className="space-y-2">
              <Label htmlFor="defaultStoryModel">Default Story Model</Label>
              <Select 
                value={settings.defaultStoryModelId || ''}
                onValueChange={(value) => handleInputChange('defaultStoryModelId', value)}
              >
                <SelectTrigger id="defaultStoryModel">
                  <SelectValue placeholder="Select default story model" />
                </SelectTrigger>
                <SelectContent>
                  {models.map(model => (
                    <SelectItem key={model.id} value={model.id}>
                      {model.name} ({model.provider})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="fallbackStoryModel">Fallback Story Model (Optional)</Label>
              <Select 
                value={settings.fallbackStoryModelId || ''}
                onValueChange={(value) => handleInputChange('fallbackStoryModelId', value)}
              >
                <SelectTrigger id="fallbackStoryModel">
                  <SelectValue placeholder="Select fallback story model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem> {/* Option for no fallback */}
                  {models.map(model => (
                    <SelectItem key={model.id} value={model.id}>
                      {model.name} ({model.provider})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sequel Models */}
            <div className="space-y-2">
              <Label htmlFor="defaultSequelModel">Default Sequel Model</Label>
              <Select 
                value={settings.defaultSequelModelId || ''}
                onValueChange={(value) => handleInputChange('defaultSequelModelId', value)}
              >
                <SelectTrigger id="defaultSequelModel">
                  <SelectValue placeholder="Select default sequel model" />
                </SelectTrigger>
                <SelectContent>
                  {models.map(model => (
                    <SelectItem key={model.id} value={model.id}>
                      {model.name} ({model.provider})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="fallbackSequelModel">Fallback Sequel Model (Optional)</Label>
              <Select 
                value={settings.fallbackSequelModelId || ''}
                onValueChange={(value) => handleInputChange('fallbackSequelModelId', value)}
              >
                <SelectTrigger id="fallbackSequelModel">
                  <SelectValue placeholder="Select fallback sequel model" />
                </SelectTrigger>
                <SelectContent>
                   <SelectItem value="">None</SelectItem> {/* Option for no fallback */}
                  {models.map(model => (
                    <SelectItem key={model.id} value={model.id}>
                      {model.name} ({model.provider})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Prompt Configuration</CardTitle>
          <CardDescription>
            Define the default system prompts used during generation.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="defaultStoryPrompt">Default Story Prompt</Label>
            <Textarea
              id="defaultStoryPrompt"
              placeholder="Enter the default system prompt for story generation..."
              value={settings.defaultStoryPrompt || ''}
              onChange={(e) => handleInputChange('defaultStoryPrompt', e.target.value)}
              rows={6}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="defaultSequelPrompt">Default Sequel Prompt</Label>
            <Textarea
              id="defaultSequelPrompt"
              placeholder="Enter the default system prompt for sequel generation..."
              value={settings.defaultSequelPrompt || ''}
              onChange={(e) => handleInputChange('defaultSequelPrompt', e.target.value)}
              rows={6}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving || isLoading}>
          {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />} 
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default AISettingsPage;

