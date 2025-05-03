
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from '@/hooks/use-toast';
import { 
  createTotpSecret,
  getTotpSecret,
  getTotpOtpAuthUrl,
  verifyTotpCode,
  disableTotp,
  isTotpEnabled
} from './totpHelpers';

// Check if user has MFA enabled
export const checkUserMfaStatus = async (userId: string): Promise<boolean> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    return userDoc.data()?.mfa?.enabled || false;
  } catch (error) {
    console.error('Error checking MFA status:', error);
    return false;
  }
};

// Enable 2FA
export const enableTwoFactorAuth = async (userId: string): Promise<string> => {
  try {
    const secret = await createTotpSecret(userId);
    return secret;
  } catch (error) {
    console.error('Error enabling 2FA:', error);
    throw new Error('Failed to enable two-factor authentication');
  }
};

// Verify 2FA code
export const verifyTwoFactorCode = async (userId: string, code: string): Promise<boolean> => {
  try {
    const secret = await getTotpSecret(userId);
    if (!secret) {
      throw new Error('TOTP secret not found');
    }

    const isValid = await verifyTotpCode(userId, code);
    return isValid;
  } catch (error) {
    console.error('Error verifying 2FA code:', error);
    throw new Error('Failed to verify code');
  }
};

// Disable 2FA
export const disableTwoFactorAuth = async (userId: string): Promise<boolean> => {
  try {
    await disableTotp(userId);
    
    toast({
      title: "2FA Disabled",
      description: "Two-factor authentication has been disabled for your account",
    });
    
    return true;
  } catch (error) {
    console.error('Error disabling 2FA:', error);
    toast({
      title: "Error",
      description: "Failed to disable two-factor authentication",
      variant: "destructive",
    });
    return false;
  }
};

// Generate a QR code for TOTP setup
export const generateTotpQrCode = async (userId: string, email: string): Promise<string> => {
  try {
    const secret = await getTotpSecret(userId);
    if (!secret) {
      throw new Error('TOTP secret not found');
    }
    
    return getTotpOtpAuthUrl(secret, email);
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
};
