
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from '@/hooks/use-toast';
import { Save } from 'lucide-react';

interface SecuritySettingsProps {
  twoFactorAuth: boolean;
}

const SecuritySettingsSection = ({ twoFactorAuth }: SecuritySettingsProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth,
    sessionTimeout: 30, // minutes
    ipRestriction: false,
    allowedIPs: '192.168.1.1, 10.0.0.1',
    enforceStrongPasswords: true,
    passwordExpiryDays: 90,
  });

  const handleSecurityChange = (key, value) => {
    setSecuritySettings(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSecuritySave = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      toast({
        title: "Security settings updated",
        description: "Your security settings have been updated successfully.",
        variant: "default",
      });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Security Settings</CardTitle>
        <CardDescription>
          Configure additional security options
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Session Timeout</p>
              <p className="text-sm text-muted-foreground">
                Automatically log out after inactivity
              </p>
            </div>
            <div className="w-20">
              <Input
                type="number"
                value={securitySettings.sessionTimeout}
                onChange={(e) => handleSecurityChange('sessionTimeout', parseInt(e.target.value))}
                min={5}
                className="text-right"
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Timeout in minutes</p>
        </div>

        <div className="pt-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">IP Restriction</p>
              <p className="text-sm text-muted-foreground">
                Limit access to specific IP addresses
              </p>
            </div>
            <Switch
              checked={securitySettings.ipRestriction}
              onCheckedChange={(checked) => handleSecurityChange('ipRestriction', checked)}
            />
          </div>
          
          {securitySettings.ipRestriction && (
            <div className="space-y-2">
              <Input
                id="allowedIPs"
                value={securitySettings.allowedIPs}
                onChange={(e) => handleSecurityChange('allowedIPs', e.target.value)}
                placeholder="192.168.1.1, 10.0.0.1"
              />
            </div>
          )}
        </div>

        <div className="pt-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Enforce Strong Passwords</p>
              <p className="text-sm text-muted-foreground">
                Require complex passwords with letters, numbers, and symbols
              </p>
            </div>
            <Switch
              checked={securitySettings.enforceStrongPasswords}
              onCheckedChange={(checked) => handleSecurityChange('enforceStrongPasswords', checked)}
            />
          </div>
        </div>

        <div className="pt-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Password Expiry</p>
              <p className="text-sm text-muted-foreground">
                Days until password must be changed
              </p>
            </div>
            <div className="w-20">
              <Input
                type="number"
                value={securitySettings.passwordExpiryDays}
                onChange={(e) => handleSecurityChange('passwordExpiryDays', parseInt(e.target.value))}
                min={0}
                className="text-right"
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">0 means passwords never expire</p>
        </div>

        <div className="pt-4">
          <Button 
            onClick={handleSecuritySave}
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
                <Save className="h-4 w-4" /> Save Security Settings
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecuritySettingsSection;
