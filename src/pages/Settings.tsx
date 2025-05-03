import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { checkUserMfaStatus, isTotpEnabled } from '@/utils/authHelpers';

// Import settings components
import AccountSection from '@/components/settings/AccountSection';
import PasswordSection from '@/components/settings/PasswordSection';
import TwoFactorAuthSection from '@/components/settings/TwoFactorAuthSection';
import SecuritySettingsSection from '@/components/settings/SecuritySettingsSection';
import NotificationsSection from '@/components/settings/NotificationsSection';
import SessionsSection from '@/components/settings/SessionsSection';
import ConnectedAppsSection from '@/components/settings/ConnectedAppsSection';

const SettingsPage = () => {
  const { currentUser, logout } = useAuth();
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
  });
  const [isLoadingTotpStatus, setIsLoadingTotpStatus] = useState(true);
  const [totpEnabled, setTotpEnabled] = useState(false);

  // Check MFA status on load
  useEffect(() => {
    const checkMfa = async () => {
      if (currentUser?.id) {
        try {
          const hasMfa = await checkUserMfaStatus(currentUser.id);
          console.log('MFA check result:', hasMfa);
          setSecuritySettings(prev => ({
            ...prev,
            twoFactorAuth: hasMfa
          }));
        } catch (error) {
          console.error('Error checking MFA status:', error);
        }
      }
    };
    
    checkMfa();
  }, [currentUser]);

  // Check TOTP status on load and set the correct UI state
  useEffect(() => {
    const checkTotpStatus = async () => {
      if (!currentUser?.id) {
        setIsLoadingTotpStatus(false);
      return;
    }
    
      setIsLoadingTotpStatus(true);
      try {
        const enabled = await isTotpEnabled(currentUser.id);
        console.log('TOTP enabled status:', enabled);
        setTotpEnabled(enabled);
        
        // If TOTP is enabled, update security settings
        if (enabled) {
          setSecuritySettings(prev => ({
            ...prev,
            twoFactorAuth: true
          }));
      }
    } catch (error) {
        console.error('Error checking TOTP status:', error);
    } finally {
        setIsLoadingTotpStatus(false);
      }
    };

    checkTotpStatus();
  }, [currentUser]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={logout}
          className="flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" /> Sign Out
        </Button>
      </div>

      <Tabs defaultValue="account">
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="account" className="space-y-6 mt-6">
          <AccountSection currentUser={currentUser} />
          <PasswordSection />
        </TabsContent>
        
        <TabsContent value="security" className="mt-6 space-y-6">
          <TwoFactorAuthSection currentUser={currentUser} />
          <SecuritySettingsSection twoFactorAuth={securitySettings.twoFactorAuth} />
        </TabsContent>
        
        <TabsContent value="notifications" className="mt-6">
          <NotificationsSection />
        </TabsContent>
        
        <TabsContent value="sessions" className="mt-6 space-y-6">
          <SessionsSection />
          <ConnectedAppsSection />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
