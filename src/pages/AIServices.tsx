
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Plus, RefreshCw, ToggleLeft, Wand2, Zap, Brain, Upload, Download, Settings, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AIModel, AIPromptTemplate } from '@/types';
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

// Mock data
const mockModels: AIModel[] = [
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "OpenAI",
    version: "1.0",
    active: true,
    costPerToken: 0.00007,
    maxTokens: 128000,
    avgResponseTime: 1.2
  },
  {
    id: "claude-3-opus",
    name: "Claude 3 Opus",
    provider: "Anthropic",
    version: "1.0",
    active: true,
    costPerToken: 0.00015,
    maxTokens: 200000,
    avgResponseTime: 1.5
  },
  {
    id: "gemini-pro",
    name: "Gemini Pro",
    provider: "Google",
    version: "1.0",
    active: false,
    costPerToken: 0.00005,
    maxTokens: 32000,
    avgResponseTime: 0.9
  },
  {
    id: "mixtral-8x7b",
    name: "Mixtral 8x7B",
    provider: "Mistral AI",
    version: "1.0",
    active: true,
    costPerToken: 0.00003,
    maxTokens: 32000,
    avgResponseTime: 1.1
  },
  {
    id: "llama-3-70b",
    name: "Llama 3 70B",
    provider: "Meta",
    version: "1.0",
    active: false,
    costPerToken: 0.00002,
    maxTokens: 8000,
    avgResponseTime: 1.3
  }
];

const mockPromptTemplates: AIPromptTemplate[] = [
  {
    id: "story-generator",
    name: "Story Generator",
    template: "Create a children's story about {theme} with a main character named {character_name} who learns about {moral_lesson}. The story should be appropriate for {age_range} year olds and include {setting} as the main setting.",
    version: 3,
    modelId: "gpt-4o",
    createdAt: "2024-03-15T10:30:00Z",
    updatedAt: "2024-04-28T14:22:00Z",
    createdBy: "admin"
  },
  {
    id: "character-description",
    name: "Character Description",
    template: "Create a detailed description of a character named {character_name} who is {age} years old and has {personality_trait} as their main personality trait. They live in {setting} and their biggest dream is to {dream}.",
    version: 2,
    modelId: "claude-3-opus",
    createdAt: "2024-02-20T09:15:00Z",
    updatedAt: "2024-04-10T11:30:00Z",
    createdBy: "content_editor"
  },
  {
    id: "illustration-prompt",
    name: "Illustration Prompt",
    template: "Generate an illustration prompt for a {style} style image showing {character_description} in {scene_description} with {mood} lighting. The illustration should emphasize {focal_point} and use a color palette that includes {color_scheme}.",
    version: 5,
    modelId: "gpt-4o",
    createdAt: "2024-01-10T14:45:00Z",
    updatedAt: "2024-05-01T09:20:00Z",
    createdBy: "admin"
  },
  {
    id: "audio-narration",
    name: "Audio Narration",
    template: "Create a narration script for a {duration} minute audio recording that tells the story of {story_title}. The narration should be in a {tone} tone and include sound effect suggestions for {sound_effect_moments}.",
    version: 1,
    modelId: "mixtral-8x7b",
    createdAt: "2024-04-05T16:20:00Z",
    updatedAt: "2024-04-05T16:20:00Z",
    createdBy: "voice_director"
  }
];

const AIServices = () => {
  const { toast } = useToast();
  const [searchModels, setSearchModels] = useState("");
  const [searchTemplates, setSearchTemplates] = useState("");
  const [activeTab, setActiveTab] = useState("models");

  // Filter models based on search
  const filteredModels = mockModels.filter(model => 
    model.name.toLowerCase().includes(searchModels.toLowerCase()) ||
    model.provider.toLowerCase().includes(searchModels.toLowerCase())
  );

  // Filter templates based on search
  const filteredTemplates = mockPromptTemplates.filter(template => 
    template.name.toLowerCase().includes(searchTemplates.toLowerCase()) ||
    template.template.toLowerCase().includes(searchTemplates.toLowerCase())
  );

  const toggleModelStatus = (id: string, currentStatus: boolean) => {
    toast({
      title: `Model ${currentStatus ? "deactivated" : "activated"}`,
      description: `The model has been ${currentStatus ? "deactivated" : "activated"} successfully.`,
    });
  };

  const handleCreateNew = (type: string) => {
    toast({
      title: `Create new ${type}`,
      description: `Creating a new ${type} functionality will be implemented soon.`,
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Services</h1>
          <p className="text-muted-foreground">
            Manage AI models and prompt templates used in your application
          </p>
        </div>
        <Button onClick={() => handleCreateNew(activeTab === "models" ? "model" : "template")}>
          <Plus className="mr-2 h-4 w-4" />
          Add {activeTab === "models" ? "Model" : "Template"}
        </Button>
      </div>

      <Tabs 
        defaultValue="models" 
        className="w-full"
        onValueChange={(value) => setActiveTab(value)}
      >
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="models">AI Models</TabsTrigger>
          <TabsTrigger value="templates">Prompt Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="models" className="space-y-4">
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search models..." 
              className="flex-1"
              value={searchModels}
              onChange={(e) => setSearchModels(e.target.value)}
            />
            <Button variant="outline" size="icon">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredModels.map(model => (
              <Card key={model.id} className={!model.active ? "opacity-70" : ""}>
                <CardHeader className="pb-2">
                  <CardTitle className="flex justify-between items-center">
                    <span>{model.name}</span>
                    <Badge variant={model.active ? "default" : "outline"}>
                      {model.active ? "Active" : "Inactive"}
                    </Badge>
                  </CardTitle>
                  <CardDescription>{model.provider} • v{model.version}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 pb-2">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Cost per token</p>
                      <p className="font-medium">${model.costPerToken.toFixed(5)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Max tokens</p>
                      <p className="font-medium">{model.maxTokens.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Avg. response time</p>
                      <p className="font-medium">{model.avgResponseTime}s</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-2">
                  <div className="w-full flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id={`model-status-${model.id}`} 
                        checked={model.active}
                        onCheckedChange={() => toggleModelStatus(model.id, model.active)}
                      />
                      <Label htmlFor={`model-status-${model.id}`}>
                        {model.active ? "Enabled" : "Disabled"}
                      </Label>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search prompt templates..." 
              className="flex-1"
              value={searchTemplates}
              onChange={(e) => setSearchTemplates(e.target.value)}
            />
            <Button variant="outline" size="icon">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {filteredTemplates.map(template => (
              <Card key={template.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle>{template.name}</CardTitle>
                    <Badge>v{template.version}</Badge>
                  </div>
                  <CardDescription className="flex items-center gap-1">
                    <Wand2 className="h-3.5 w-3.5 text-muted-foreground" />
                    Uses {mockModels.find(m => m.id === template.modelId)?.name || template.modelId}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="bg-muted p-3 rounded-md text-sm font-mono overflow-auto max-h-24">
                    {template.template}
                  </div>
                  <div className="flex justify-between items-center mt-3 text-xs text-muted-foreground">
                    <span>Created: {formatDate(template.createdAt)}</span>
                    <span>Updated: {formatDate(template.updatedAt)}</span>
                  </div>
                </CardContent>
                <CardFooter className="pt-2 justify-end space-x-2">
                  <Button variant="outline" size="sm">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Test
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button size="sm">
                    Edit
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIServices;
