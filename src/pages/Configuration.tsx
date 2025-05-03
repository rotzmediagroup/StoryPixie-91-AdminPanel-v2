import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Database, Globe, Smartphone, Laptop, Save } from "lucide-react";
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Mock feature flags data for the demo
const featureFlagsInitial = {
  web: {
    enableNewStoryUI: true,
    enableImageGeneration: true,
    enableVoiceSelection: true,
    enableSharingFeature: false,
    enableBetaFeatures: false,
  },
  ios: {
    enableNewStoryUI: true,
    enableImageGeneration: true,
    enableVoiceSelection: false,
    enableSharingFeature: true,
    enableBetaFeatures: false,
  },
  android: {
    enableNewStoryUI: false,
    enableImageGeneration: true,
    enableVoiceSelection: true, 
    enableSharingFeature: false,
    enableBetaFeatures: false,
  }
};

// Mock global settings data for the demo
const globalSettingsInitial = {
  storiesPerDay: 5,
  maxImagesPerStory: 3,
  audioDefaultEnabled: true,
  defaultVoice: "Emma",
  defaultLanguage: "en-US",
  maxResponseTime: 15000, // in ms
  aiDefaultModel: "gpt-4-turbo",
  allowGuestAccess: true,
  creditCost: {
    story: 1,
    image: 0.5,
    audioMinute: 0.25,
  },
  systemMessages: {
    welcome: "Welcome to Story Pixie!",
    newUser: "Thank you for joining Story Pixie!",
  },
};

const ConfigurationPage = () => {
  const [featureFlags, setFeatureFlags] = useState(featureFlagsInitial);
  const [globalSettings, setGlobalSettings] = useState(globalSettingsInitial);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  
  // Update feature flag handler
  const updateFeatureFlag = (platform: 'web' | 'ios' | 'android', flag: string, value: boolean) => {
    setFeatureFlags(prev => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        [flag]: value
      }
    }));
    setIsDirty(true);
  };
  
  // Update global settings handler
  const updateGlobalSetting = (key: keyof typeof globalSettingsInitial, value: unknown) => {
    setGlobalSettings(prev => ({
      ...prev,
      [key]: value
    }));
    setIsDirty(true);
  };
  
  // Handle nested object updates
  const updateNestedSetting = (parentKey: keyof typeof globalSettingsInitial, key: string, value: unknown) => {
    setGlobalSettings(prev => ({
      ...prev,
      [parentKey]: {
        ...prev[parentKey],
        [key]: value
      }
    }));
    setIsDirty(true);
  };
  
  // Save changes handler
  const handleSaveChanges = () => {
    setIsSubmitting(true);
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      toast({
        title: "Configuration saved",
        description: "Your configuration changes have been saved successfully.",
        variant: "default",
      });
      
      setIsSubmitting(false);
      setIsDirty(false);
    }, 1500);
  };
  
  const resetToDefaults = () => {
    setFeatureFlags(featureFlagsInitial);
    setGlobalSettings(globalSettingsInitial);
    setIsDirty(true);
    
    toast({
      title: "Reset to defaults",
      description: "All configuration settings have been reset to their default values.",
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configuration</h1>
          <p className="text-muted-foreground">
            Manage system-wide settings and feature flags
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Reset to Defaults</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Reset Configuration?</DialogTitle>
                <DialogDescription>
                  This will reset all configuration settings to their default values. This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => {}}>Cancel</Button>
                <Button 
                  variant="destructive" 
                  onClick={() => resetToDefaults()}
                >
                  Reset All Settings
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Button 
            onClick={handleSaveChanges} 
            disabled={!isDirty || isSubmitting}
            className="flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" /> Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="feature-flags">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="feature-flags">Feature Flags</TabsTrigger>
          <TabsTrigger value="global-settings">Global Settings</TabsTrigger>
          <TabsTrigger value="api-keys">API Keys</TabsTrigger>
        </TabsList>
        
        <TabsContent value="feature-flags">
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-3 mt-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-2">
                  <Globe className="h-5 w-5" />
                  <CardTitle>Web Platform</CardTitle>
                </div>
                <CardDescription>
                  Feature flags for the web application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(featureFlags.web).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <Label htmlFor={`web-${key}`} className="flex-1 cursor-pointer">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </Label>
                    <Switch
                      id={`web-${key}`}
                      checked={value}
                      onCheckedChange={checked => updateFeatureFlag('web', key, checked)}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-2">
                  <Smartphone className="h-5 w-5" />
                  <CardTitle>iOS Platform</CardTitle>
                </div>
                <CardDescription>
                  Feature flags for the iOS application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(featureFlags.ios).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <Label htmlFor={`ios-${key}`} className="flex-1 cursor-pointer">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </Label>
                    <Switch
                      id={`ios-${key}`}
                      checked={value}
                      onCheckedChange={checked => updateFeatureFlag('ios', key, checked)}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-2">
                  <Smartphone className="h-5 w-5" />
                  <CardTitle>Android Platform</CardTitle>
                </div>
                <CardDescription>
                  Feature flags for the Android application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(featureFlags.android).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <Label htmlFor={`android-${key}`} className="flex-1 cursor-pointer">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </Label>
                    <Switch
                      id={`android-${key}`}
                      checked={value}
                      onCheckedChange={checked => updateFeatureFlag('android', key, checked)}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="global-settings">
          <div className="grid gap-6 mt-6 grid-cols-1">
            <Card>
              <CardHeader>
                <CardTitle>Application Settings</CardTitle>
                <CardDescription>
                  Configure global application behavior across all platforms
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="storiesPerDay">Stories Per Day Limit</Label>
                    <Input
                      id="storiesPerDay"
                      type="number"
                      value={globalSettings.storiesPerDay}
                      onChange={(e) => updateGlobalSetting('storiesPerDay', parseInt(e.target.value))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="maxImagesPerStory">Max Images Per Story</Label>
                    <Input
                      id="maxImagesPerStory"
                      type="number"
                      value={globalSettings.maxImagesPerStory}
                      onChange={(e) => updateGlobalSetting('maxImagesPerStory', parseInt(e.target.value))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="defaultVoice">Default Voice</Label>
                    <Input
                      id="defaultVoice"
                      value={globalSettings.defaultVoice}
                      onChange={(e) => updateGlobalSetting('defaultVoice', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="defaultLanguage">Default Language</Label>
                    <Input
                      id="defaultLanguage"
                      value={globalSettings.defaultLanguage}
                      onChange={(e) => updateGlobalSetting('defaultLanguage', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="maxResponseTime">Max Response Time (ms)</Label>
                    <Input
                      id="maxResponseTime"
                      type="number"
                      value={globalSettings.maxResponseTime}
                      onChange={(e) => updateGlobalSetting('maxResponseTime', parseInt(e.target.value))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="aiDefaultModel">Default AI Model</Label>
                    <Input
                      id="aiDefaultModel"
                      value={globalSettings.aiDefaultModel}
                      onChange={(e) => updateGlobalSetting('aiDefaultModel', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Feature Toggles</h3>
                  
                  <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="audioDefaultEnabled" className="cursor-pointer">
                        Audio Default Enabled
                      </Label>
                      <Switch
                        id="audioDefaultEnabled"
                        checked={globalSettings.audioDefaultEnabled}
                        onCheckedChange={(checked) => updateGlobalSetting('audioDefaultEnabled', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="allowGuestAccess" className="cursor-pointer">
                        Allow Guest Access
                      </Label>
                      <Switch
                        id="allowGuestAccess"
                        checked={globalSettings.allowGuestAccess}
                        onCheckedChange={(checked) => updateGlobalSetting('allowGuestAccess', checked)}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Credit Costs</h3>
                  
                  <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="creditCostStory">Cost per Story</Label>
                      <Input
                        id="creditCostStory"
                        type="number"
                        step="0.25"
                        value={globalSettings.creditCost.story}
                        onChange={(e) => updateNestedSetting('creditCost', 'story', parseFloat(e.target.value))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="creditCostImage">Cost per Image</Label>
                      <Input
                        id="creditCostImage"
                        type="number"
                        step="0.25"
                        value={globalSettings.creditCost.image}
                        onChange={(e) => updateNestedSetting('creditCost', 'image', parseFloat(e.target.value))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="creditCostAudioMinute">Cost per Audio Minute</Label>
                      <Input
                        id="creditCostAudioMinute"
                        type="number"
                        step="0.25"
                        value={globalSettings.creditCost.audioMinute}
                        onChange={(e) => updateNestedSetting('creditCost', 'audioMinute', parseFloat(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">System Messages</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="welcomeMessage">Welcome Message</Label>
                    <Input
                      id="welcomeMessage"
                      value={globalSettings.systemMessages.welcome}
                      onChange={(e) => updateNestedSetting('systemMessages', 'welcome', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="newUserMessage">New User Message</Label>
                    <Input
                      id="newUserMessage"
                      value={globalSettings.systemMessages.newUser}
                      onChange={(e) => updateNestedSetting('systemMessages', 'newUser', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="api-keys">
          <div className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Database className="h-5 w-5" />
                  <CardTitle>API Keys</CardTitle>
                </div>
                <CardDescription>
                  Manage API keys for external services
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="openaiApiKey">OpenAI API Key</Label>
                    <div className="flex">
                      <Input
                        id="openaiApiKey"
                        type="password"
                        value="sk-••••••••••••••••••••••••••••••••••••••••••"
                        className="rounded-r-none"
                        readOnly
                      />
                      <Button className="rounded-l-none" variant="secondary">
                        Update
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="stabilityApiKey">Stability AI API Key</Label>
                    <div className="flex">
                      <Input
                        id="stabilityApiKey"
                        type="password"
                        value="sk-••••••••••••••••••••••••••••••••••••••••••"
                        className="rounded-r-none"
                        readOnly
                      />
                      <Button className="rounded-l-none" variant="secondary">
                        Update
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="elevenLabsApiKey">ElevenLabs API Key</Label>
                    <div className="flex">
                      <Input
                        id="elevenLabsApiKey"
                        type="password"
                        value="••••••••••••••••••••••••••••••••"
                        className="rounded-r-none"
                        readOnly
                      />
                      <Button className="rounded-l-none" variant="secondary">
                        Update
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="stripeApiKey">Stripe API Key</Label>
                    <div className="flex">
                      <Input
                        id="stripeApiKey"
                        type="password"
                        value="sk_test_••••••••••••••••••••••••••••••••"
                        className="rounded-r-none"
                        readOnly
                      />
                      <Button className="rounded-l-none" variant="secondary">
                        Update
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <h3 className="text-lg font-medium mb-4">Webhook Endpoints</h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="slackWebhook">Slack Notification Webhook</Label>
                      <Input
                        id="slackWebhook"
                        type="text"
                        value="https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="errorWebhook">Error Reporting Webhook</Label>
                      <Input
                        id="errorWebhook"
                        type="text"
                        value="https://api.errortracking.com/v1/report/12345abcdef"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">
                  API keys are encrypted before storing. Last updated: May 1, 2025, 09:45 AM UTC
                </p>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ConfigurationPage;
