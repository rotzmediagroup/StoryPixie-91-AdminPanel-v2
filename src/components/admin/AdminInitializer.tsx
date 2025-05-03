
import { useEffect, useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalDescription } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { createTotpSecret, getTotpOtpAuthUrl, verifyTotpCode, isTotpEnabled } from '@/utils/authHelpers';

// Define a type for the TOTP step to ensure consistent values
type TotpStep = 'idle' | 'generating' | 'showing' | 'verifying' | 'success' | 'error';

// This component is used to initialize admin-related functionality
const AdminInitializer = () => {
  const { currentUser } = useAuth();
  const [showWizard, setShowWizard] = useState(false);
  const [totpStep, setTotpStep] = useState<TotpStep>('idle');
  const [totpSecret, setTotpSecret] = useState<string | null>(null);
  const [totpQrUrl, setTotpQrUrl] = useState<string | null>(null);
  const [totpCode, setTotpCode] = useState('');
  const [totpError, setTotpError] = useState<string | null>(null);

  useEffect(() => {
    const check = async () => {
      if (currentUser?.id) {
        const enabled = await isTotpEnabled(currentUser.id);
        setShowWizard(!enabled);
      }
    };
    check();
  }, [currentUser]);

  const handleTotpStart = async () => {
    setTotpStep('generating');
    setTotpError(null);
    try {
      if (!currentUser?.id || !currentUser.email) throw new Error('No user');
      const secret = await createTotpSecret(currentUser.id);
      setTotpSecret(secret);
      setTotpQrUrl(getTotpOtpAuthUrl(secret, currentUser.email));
      setTotpStep('showing');
    } catch (e) {
      setTotpError('Failed to generate secret.');
      setTotpStep('error');
    }
  };

  const handleTotpVerify = async () => {
    setTotpStep('verifying');
    setTotpError(null);
    try {
      if (!currentUser?.id) throw new Error('No user');
      const ok = await verifyTotpCode(currentUser.id, totpCode);
      if (ok) {
        setTotpStep('success');
        setShowWizard(false);
      } else {
        setTotpError('Invalid code. Try again.');
        setTotpStep('showing');
      }
    } catch (e) {
      setTotpError('Verification failed.');
      setTotpStep('showing');
    }
  };

  if (!showWizard) return null;

  return (
    <Modal open={showWizard} onOpenChange={() => {}}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Secure Your Admin Account</ModalTitle>
          <ModalDescription>
            For your security, please set up two-factor authentication (TOTP) with an authenticator app before using the admin panel.
          </ModalDescription>
        </ModalHeader>
        <div className="space-y-4">
          {totpStep === 'idle' && (
            <Button onClick={handleTotpStart}>Start TOTP Setup</Button>
          )}
          {totpStep === 'generating' && <p>Generating secret...</p>}
          {totpStep === 'showing' && totpQrUrl && totpSecret && (
            <div className="space-y-4">
              <div className="flex flex-col items-center space-y-2">
                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(totpQrUrl)}`} alt="TOTP QR Code" className="w-40 h-40" />
                <p className="text-xs text-muted-foreground">Scan this QR code with your authenticator app.</p>
                <div className="font-mono bg-slate-100 p-2 rounded text-sm break-all">{totpSecret}</div>
                <p className="text-xs text-muted-foreground">Or enter this code manually.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="totpCode">Enter code from app</Label>
                <Input id="totpCode" value={totpCode} onChange={e => setTotpCode(e.target.value)} maxLength={6} className="text-center" placeholder="000000" />
                <Button onClick={handleTotpVerify} disabled={totpCode.length !== 6}>Verify & Activate</Button>
                {totpError && <p className="text-destructive text-sm">{totpError}</p>}
              </div>
            </div>
          )}
          {totpStep === 'verifying' && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2">Verifying code...</p>
            </div>
          )}
          {totpStep === 'success' && (
            <div className="text-green-700 font-medium">TOTP 2FA is now enabled! You may now use the admin panel.</div>
          )}
          {totpStep === 'error' && (
            <div className="text-destructive font-medium">{totpError || 'Something went wrong.'}</div>
          )}
        </div>
      </ModalContent>
    </Modal>
  );
};

export default AdminInitializer;
