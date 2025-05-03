
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTotpSetup } from './TotpSetupContext';
import { verifyTotpCode, isTotpEnabled } from '@/utils/auth/totpHelpers';
import { toast } from '@/hooks/use-toast';

interface TotpVerificationProps {
  userId: string;
  onSuccess?: () => void;
}

const TotpVerification: React.FC<TotpVerificationProps> = ({ userId, onSuccess }) => {
  const { 
    totpStep,
    totpQrUrl, 
    totpSecret, 
    totpCode, 
    setTotpCode, 
    totpError,
    setTotpStep,
    setTotpError,
    setTotpEnabled,
    setTotpQrUrl,
    setTotpSecret
  } = useTotpSetup();

  const handleTotpVerify = async () => {
    setTotpStep('verifying');
    setTotpError(null);
    try {
      if (!userId) throw new Error('No user');
      const ok = await verifyTotpCode(userId, totpCode);
      if (ok) {
        // Re-check Firestore for the enabled status
        const enabled = await isTotpEnabled(userId);
        setTotpEnabled(enabled);
        setTotpStep('success');
        toast({ title: 'TOTP enabled', description: 'Authenticator app 2FA is now active.' });
        
        // Call the onSuccess callback if provided
        if (onSuccess) {
          onSuccess();
        }
      } else {
        setTotpError('Invalid code. Try again.');
        setTotpStep('showing');
      }
    } catch (e) {
      console.error("Error verifying TOTP code:", e);
      setTotpError('Verification failed.');
      setTotpStep('showing');
    }
  };

  const handleTotpReset = () => {
    setTotpStep('idle');
    setTotpSecret(null);
    setTotpQrUrl(null);
    setTotpCode('');
    setTotpError(null);
  };

  if (totpStep !== 'showing' || !totpQrUrl || !totpSecret) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="totpCode">Enter code from app</Label>
        <Input 
          id="totpCode" 
          value={totpCode} 
          onChange={e => setTotpCode(e.target.value)} 
          maxLength={6} 
          className="text-center" 
          placeholder="000000" 
        />
        <Button 
          onClick={handleTotpVerify} 
          disabled={totpCode.length !== 6}
          className="w-full"
        >
          Verify & Activate
        </Button>
        <Button variant="outline" onClick={handleTotpReset} className="w-full">Cancel</Button>
        {totpError && <p className="text-destructive text-sm">{totpError}</p>}
      </div>
    </div>
  );
};

export default TotpVerification;
