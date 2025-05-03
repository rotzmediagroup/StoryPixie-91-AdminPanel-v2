
import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from 'lucide-react';
import { isTotpEnabled } from '@/utils/authHelpers';
import { TotpSetupProvider } from './totp/TotpSetupContext';
import TotpStatus from './totp/TotpStatus';
import { User } from '@/types';

interface TwoFactorAuthSectionProps {
  currentUser: User;
}

const TwoFactorAuthSection = ({ currentUser }: TwoFactorAuthSectionProps) => {
  const [isLoadingTotpStatus, setIsLoadingTotpStatus] = React.useState(true);
  const [totpEnabled, setTotpEnabled] = React.useState(false);

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
      } catch (error) {
        console.error('Error checking TOTP status:', error);
      } finally {
        setIsLoadingTotpStatus(false);
      }
    };

    checkTotpStatus();
  }, [currentUser]);

  if (!currentUser) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <CardTitle>Two-Factor Authentication (TOTP)</CardTitle>
          </div>
          <CardDescription>
            Add an extra layer of security to your account using an authenticator app.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 text-center text-muted-foreground">
            You need to be logged in to manage two-factor authentication.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Shield className="h-5 w-5" />
          <CardTitle>Two-Factor Authentication (TOTP)</CardTitle>
        </div>
        <CardDescription>
          Add an extra layer of security to your account using an authenticator app.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <TotpSetupProvider initialEnabled={totpEnabled}>
          <TotpStatus 
            userId={currentUser.id}
            userEmail={currentUser.email}
            isLoading={isLoadingTotpStatus}
          />
        </TotpSetupProvider>
      </CardContent>
    </Card>
  );
};

export default TwoFactorAuthSection;
