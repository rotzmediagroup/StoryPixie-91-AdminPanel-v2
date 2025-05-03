
import React from 'react';
import { Button } from "@/components/ui/button";
import { useTotpSetup } from './TotpSetupContext';
import { disableTotp } from '@/utils/auth/totpHelpers';
import { toast } from '@/hooks/use-toast';

interface TotpDisableProps {
  userId: string;
}

const TotpDisable: React.FC<TotpDisableProps> = ({ userId }) => {
  const { setTotpEnabled, setTotpStep } = useTotpSetup();

  const handleTotpDisable = async () => {
    if (!userId) return;
    try {
      await disableTotp(userId);
      setTotpEnabled(false);
      setTotpStep('idle');
      toast({ title: 'TOTP disabled', description: 'Authenticator app 2FA is now disabled.' });
    } catch (error) {
      console.error("Error disabling TOTP:", error);
      toast({ 
        title: 'Error',
        description: 'Failed to disable 2FA. Please try again.',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="space-y-2">
      <p className="text-green-700 font-medium">TOTP 2FA is enabled for your account.</p>
      <Button variant="destructive" onClick={handleTotpDisable}>Disable 2FA</Button>
    </div>
  );
};

export default TotpDisable;
