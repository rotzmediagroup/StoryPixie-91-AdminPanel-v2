
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from '@/hooks/use-toast';
import { Bell, Save } from 'lucide-react';

const NotificationsSection = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    emailAlerts: true,
    securityAlerts: true,
    marketingEmails: false,
    productUpdates: true,
    loginNotifications: true,
  });

  const handleNotificationChange = (key, value) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleNotificationsSave = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      toast({
        title: "Notification preferences updated",
        description: "Your notification settings have been updated successfully.",
        variant: "default",
      });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Bell className="h-5 w-5" />
          <CardTitle>Notification Preferences</CardTitle>
        </div>
        <CardDescription>
          Choose what notifications you receive
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Email Alerts</p>
              <p className="text-sm text-muted-foreground">
                Receive system alerts via email
              </p>
            </div>
            <Switch
              checked={notificationSettings.emailAlerts}
              onCheckedChange={(checked) => handleNotificationChange('emailAlerts', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Security Alerts</p>
              <p className="text-sm text-muted-foreground">
                Receive alerts about security issues
              </p>
            </div>
            <Switch
              checked={notificationSettings.securityAlerts}
              onCheckedChange={(checked) => handleNotificationChange('securityAlerts', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Login Notifications</p>
              <p className="text-sm text-muted-foreground">
                Receive email when new login is detected
              </p>
            </div>
            <Switch
              checked={notificationSettings.loginNotifications}
              onCheckedChange={(checked) => handleNotificationChange('loginNotifications', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Product Updates</p>
              <p className="text-sm text-muted-foreground">
                Receive notifications about new features and updates
              </p>
            </div>
            <Switch
              checked={notificationSettings.productUpdates}
              onCheckedChange={(checked) => handleNotificationChange('productUpdates', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Marketing Emails</p>
              <p className="text-sm text-muted-foreground">
                Receive marketing and promotional emails
              </p>
            </div>
            <Switch
              checked={notificationSettings.marketingEmails}
              onCheckedChange={(checked) => handleNotificationChange('marketingEmails', checked)}
            />
          </div>
        </div>
        
        <div className="pt-4">
          <Button 
            onClick={handleNotificationsSave}
            disabled={isSubmitting}
            className="flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" /> Save Notification Preferences
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationsSection;
