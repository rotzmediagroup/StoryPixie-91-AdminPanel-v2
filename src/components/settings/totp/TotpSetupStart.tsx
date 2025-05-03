
import React from 'react';
import { Button } from "@/components/ui/button";
import { useTotpSetup } from './TotpSetupContext';
import { createTotpSecret, getTotpOtpAuthUrl } from '@/utils/auth/totpHelpers';

interface TotpSetupStartProps {
  userId: string;
  userEmail: string;
}

const TotpSetupStart: React.FC<TotpSetupStartProps> = ({ userId, userEmail }) => {
  const { 
    setTotpStep, 
    setTotpSecret, 
    setTotpQrUrl, 
    setTotpError 
  } = useTotpSetup();

  const handleTotpStart = async () => {
    setTotpStep('generating');
    setTotpError(null);
    try {
      if (!userId || !userEmail) throw new Error('No user');
      const secret = await createTotpSecret(userId);
      setTotpSecret(secret);
      setTotpQrUrl(getTotpOtpAuthUrl(secret, userEmail));
      setTotpStep('showing');
    } catch (e) {
      console.error("Error creating TOTP secret:", e);
      setTotpError('Failed to generate secret.');
      setTotpStep('error');
    }
  };

  return (
    <Button onClick={handleTotpStart}>Start TOTP Setup</Button>
  );
};

export default TotpSetupStart;
