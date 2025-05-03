
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { TOTP } from 'otpauth';
import * as base32 from 'hi-base32';

// Generate a secure random secret for TOTP using Web Crypto API
export const generateTotpSecret = (): string => {
  // Create a Uint8Array with 20 random bytes (160 bits) for TOTP secret
  const buffer = new Uint8Array(20);
  // Use Web Crypto API instead of Node's crypto
  window.crypto.getRandomValues(buffer);
  // Convert to byte array for base32 encoding
  const bytes = Array.from(buffer);
  // Encode as base32 which is the standard format for TOTP secrets
  return base32.encode(bytes).replace(/=/g, '');
};

// Generate a new TOTP secret and store it in Firestore (do not enable yet)
export async function createTotpSecret(userId: string): Promise<string> {
  const secret = generateTotpSecret();
  await updateDoc(doc(db, 'users', userId), {
    'mfa.totpSecret': secret,
    'mfa.totpEnabled': false,
  });
  return secret;
}

// Get the TOTP secret for a user
export async function getTotpSecret(userId: string): Promise<string | null> {
  const userDoc = await getDoc(doc(db, 'users', userId));
  return userDoc.exists() ? userDoc.data()?.mfa?.totpSecret || null : null;
}

// Generate otpauth URL for QR code
export function getTotpOtpAuthUrl(secret: string, email: string): string {
  const totp = new TOTP({
    issuer: 'Story Pixie Admin',
    label: email,
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    secret,
  });
  return totp.toString();
}

// Verify a TOTP code
export async function verifyTotpCode(userId: string, code: string): Promise<boolean> {
  const secret = await getTotpSecret(userId);
  if (!secret) return false;
  const totp = new TOTP({
    secret,
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
  });
  
  const isValid = totp.validate({ token: code, window: 1 }) !== null;
  
  // If valid, update the user's MFA status to enabled
  if (isValid) {
    await updateDoc(doc(db, 'users', userId), {
      'mfa.totpEnabled': true,
      'mfa.enabled': true
    });
  }
  
  return isValid;
}

// Enable TOTP (after successful verification)
export async function enableTotp(userId: string): Promise<void> {
  await updateDoc(doc(db, 'users', userId), {
    'mfa.totpEnabled': true,
    'mfa.enabled': true
  });
}

// Disable TOTP
export async function disableTotp(userId: string): Promise<void> {
  await updateDoc(doc(db, 'users', userId), {
    'mfa.totpEnabled': false,
    'mfa.enabled': false,
    'mfa.totpSecret': null,
  });
}

// Check if TOTP is enabled
export async function isTotpEnabled(userId: string): Promise<boolean> {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) return false;
    
    const userData = userDoc.data();
    // Check explicitly for totpEnabled flag and fallback to general mfa.enabled
    return userData?.mfa?.totpEnabled === true || userData?.mfa?.enabled === true;
  } catch (error) {
    console.error("Error checking TOTP status:", error);
    return false;
  }
}
