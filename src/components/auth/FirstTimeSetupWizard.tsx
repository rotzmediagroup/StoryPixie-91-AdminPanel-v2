
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { TotpSetupProvider } from '@/components/settings/totp/TotpSetupContext';
import TotpVerification from '@/components/settings/totp/TotpVerification';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Apple, QrCode, Smartphone } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { createTotpSecret, getTotpOtpAuthUrl } from '@/utils/authHelpers';

interface FirstTimeSetupWizardProps {
  userId: string;
  userEmail: string;
}

const FirstTimeSetupWizard: React.FC<FirstTimeSetupWizardProps> = ({ userId, userEmail }) => {
  const { completeLogin } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [showAppDialog, setShowAppDialog] = useState<boolean>(false);
  const [totpSecret, setTotpSecret] = useState<string | null>(null);
  const [totpQrUrl, setTotpQrUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const handleStartSetup = async () => {
    setIsGenerating(true);
    try {
      const secret = await createTotpSecret(userId);
      setTotpSecret(secret);
      setTotpQrUrl(getTotpOtpAuthUrl(secret, userEmail));
      setCurrentStep(2);
    } catch (error) {
      console.error("Error creating TOTP secret:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSetupComplete = () => {
    completeLogin();
    navigate('/');
  };

  // Step 1: Introduction and app download links
  if (currentStep === 1) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Welcome to Story Pixie Admin</CardTitle>
            <CardDescription>Complete Two-Factor Authentication Setup</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-md text-amber-800">
              <p className="font-medium">Security Notice</p>
              <p className="text-sm">Two-factor authentication is required for all admin users. This adds an extra layer of security to your account.</p>
            </div>
            
            <div>
              <p className="mb-2">To continue, you'll need an authenticator app:</p>
              <div className="flex flex-col sm:flex-row gap-2 mt-4">
                <Button 
                  onClick={() => setShowAppDialog(true)}
                  variant="outline" 
                  className="flex items-center gap-2 flex-1"
                >
                  <Smartphone className="h-4 w-4" /> Get Authenticator App
                </Button>
                <Button 
                  onClick={handleStartSetup} 
                  disabled={isGenerating}
                  className="flex-1"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
                      Preparing...
                    </>
                  ) : (
                    <>
                      <QrCode className="h-4 w-4 mr-2" /> Continue to Setup
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Dialog open={showAppDialog} onOpenChange={setShowAppDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Get an Authenticator App</DialogTitle>
              <DialogDescription>
                Download one of these free authenticator apps to generate codes
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <a 
                href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <img 
                  src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" 
                  alt="Get it on Google Play" 
                  className="h-8" 
                />
                <div className="ml-3">
                  <p className="font-medium">Google Authenticator</p>
                  <p className="text-sm text-gray-500">Android devices</p>
                </div>
              </a>
              
              <a 
                href="https://apps.apple.com/us/app/google-authenticator/id388497605" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Apple className="h-8 w-8" />
                <div className="ml-3">
                  <p className="font-medium">Google Authenticator</p>
                  <p className="text-sm text-gray-500">iOS devices</p>
                </div>
              </a>
              
              <p className="text-sm text-center text-gray-500 mt-4">
                You can also use other authenticator apps like Authy, Microsoft Authenticator or 1Password
              </p>
            </div>
            <div className="flex justify-end">
              <Button onClick={() => setShowAppDialog(false)}>
                Done
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Step 2: TOTP Setup and verification
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Set up Two-Factor Authentication</CardTitle>
          <CardDescription>Scan the QR code with your authenticator app</CardDescription>
        </CardHeader>
        <CardContent>
          <TotpSetupProvider>
            {totpSecret && totpQrUrl && (
              <div className="space-y-6">
                <div className="flex flex-col items-center space-y-2">
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(totpQrUrl)}`} 
                    alt="TOTP QR Code" 
                    className="w-40 h-40 border p-2" 
                  />
                  <p className="text-xs text-muted-foreground">Scan this QR code with your authenticator app</p>
                  
                  <div className="font-mono bg-slate-100 p-2 rounded text-sm break-all w-full text-center">
                    {totpSecret}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Or enter this code manually in your authenticator app
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 p-3 rounded-md text-blue-800 text-sm">
                  <p>After scanning, enter the 6-digit code from your authenticator app below to complete the setup.</p>
                </div>
                
                <TotpVerification userId={userId} onSuccess={handleSetupComplete} />
              </div>
            )}
          </TotpSetupProvider>
        </CardContent>
      </Card>
    </div>
  );
};

export default FirstTimeSetupWizard;
