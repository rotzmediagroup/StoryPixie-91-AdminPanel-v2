
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import logo from "@/assets/logo.png";

interface TwoFactorAuthFormProps {
  pendingUserId: string;
  onCancel: () => void;
  onSuccess: () => void;
}

const TwoFactorAuthForm = ({ pendingUserId, onCancel, onSuccess }: TwoFactorAuthFormProps) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleTwoFactorVerify = async () => {
    if (!pendingUserId || !verificationCode) {
      setAuthError("Please enter the verification code");
      return;
    }

    setIsVerifying(true);
    setAuthError(null);

    try {
      const isValid = await verifyTotpCode(pendingUserId, verificationCode);
      
      if (isValid) {
        onSuccess();
        toast({
          title: "Login successful",
          description: "Welcome to Story Pixie Admin Panel",
        });
        navigate('/');
      } else {
        setAuthError("Invalid verification code. Please try again.");
        setVerificationCode('');
      }
    } catch (error) {
      console.error('2FA verification error:', error);
      setAuthError((error as Error).message || "An error occurred during verification");
      setVerificationCode('');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 py-8">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="w-32 sm:w-40">
              <img 
                src={logo} 
                alt="Story Pixie Logo"
                className="w-full object-contain" 
              />
            </div>
          </div>
          <h2 className="mt-4 text-2xl sm:text-3xl font-bold">Story Pixie Admin</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Two-Factor Authentication Required
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Enter Verification Code</CardTitle>
            <CardDescription>
              Please enter the code from your authenticator app
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="verificationCode">Verification Code</Label>
              <Input
                id="verificationCode"
                type="text"
                placeholder="000000"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                maxLength={6}
              />
              {authError && (
                <p className="text-sm text-destructive">{authError}</p>
              )}
            </div>
            <Button
              onClick={handleTwoFactorVerify}
              disabled={isVerifying || verificationCode.length !== 6}
              className="w-full"
            >
              {isVerifying ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
                  Verifying...
                </>
              ) : (
                "Verify"
              )}
            </Button>
            <Button
              variant="outline"
              onClick={onCancel}
              className="w-full"
            >
              Cancel
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TwoFactorAuthForm;
