
import React from 'react';
import { useTotpSetup } from './TotpSetupContext';
import TotpSetupStart from './TotpSetupStart';
import TotpVerification from './TotpVerification';
import TotpDisable from './TotpDisable';

interface TotpStatusProps {
  userId: string;
  userEmail: string;
  isLoading: boolean;
}

const TotpStatus: React.FC<TotpStatusProps> = ({ userId, userEmail, isLoading }) => {
  const { totpStep, totpEnabled, totpError } = useTotpSetup();

  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (totpEnabled) {
    return <TotpDisable userId={userId} />;
  }

  return (
    <div className="space-y-4">
      {totpStep === 'idle' && (
        <TotpSetupStart userId={userId} userEmail={userEmail} />
      )}
      
      {totpStep === 'generating' && (
        <div className="flex justify-center py-4">
          <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
          <span className="ml-3">Generating secret...</span>
        </div>
      )}
      
      {totpStep === 'showing' && (
        <TotpVerification userId={userId} />
      )}
      
      {totpStep === 'verifying' && (
        <div className="flex justify-center py-4">
          <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
          <span className="ml-3">Verifying code...</span>
        </div>
      )}
      
      {totpStep === 'success' && (
        <div className="text-green-700 font-medium">TOTP 2FA is now enabled!</div>
      )}
      
      {totpStep === 'error' && (
        <div className="text-destructive font-medium">{totpError || 'Something went wrong.'}</div>
      )}
    </div>
  );
};

export default TotpStatus;
