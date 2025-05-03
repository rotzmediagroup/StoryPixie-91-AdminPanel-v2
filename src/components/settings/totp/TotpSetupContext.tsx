
import React, { createContext, useState, useContext, useEffect } from 'react';

// Define the TOTP step type for better type safety
export type TotpStepType = 'idle' | 'generating' | 'showing' | 'verifying' | 'success' | 'error';

interface TotpContextType {
  totpStep: TotpStepType;
  setTotpStep: (step: TotpStepType) => void;
  totpSecret: string | null;
  setTotpSecret: (secret: string | null) => void;
  totpQrUrl: string | null;
  setTotpQrUrl: (url: string | null) => void;
  totpCode: string;
  setTotpCode: (code: string) => void;
  totpError: string | null;
  setTotpError: (error: string | null) => void;
  totpEnabled: boolean;
  setTotpEnabled: (enabled: boolean) => void;
}

const TotpSetupContext = createContext<TotpContextType | undefined>(undefined);

interface TotpSetupProviderProps {
  children: React.ReactNode;
  initialEnabled?: boolean;
}

export const TotpSetupProvider: React.FC<TotpSetupProviderProps> = ({ 
  children, 
  initialEnabled = false 
}) => {
  const [totpStep, setTotpStep] = useState<TotpStepType>('idle');
  const [totpSecret, setTotpSecret] = useState<string | null>(null);
  const [totpQrUrl, setTotpQrUrl] = useState<string | null>(null);
  const [totpCode, setTotpCode] = useState('');
  const [totpError, setTotpError] = useState<string | null>(null);
  const [totpEnabled, setTotpEnabled] = useState(initialEnabled);

  // When initialEnabled changes, update state and UI
  useEffect(() => {
    setTotpEnabled(initialEnabled);
    if (initialEnabled) {
      setTotpStep('success');
    }
  }, [initialEnabled]);

  return (
    <TotpSetupContext.Provider value={{
      totpStep, setTotpStep,
      totpSecret, setTotpSecret,
      totpQrUrl, setTotpQrUrl,
      totpCode, setTotpCode,
      totpError, setTotpError,
      totpEnabled, setTotpEnabled
    }}>
      {children}
    </TotpSetupContext.Provider>
  );
};

export const useTotpSetup = () => {
  const context = useContext(TotpSetupContext);
  if (!context) {
    throw new Error('useTotpSetup must be used within a TotpSetupProvider');
  }
  return context;
};
