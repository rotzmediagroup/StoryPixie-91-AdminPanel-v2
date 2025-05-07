import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '@/lib/firebase'; // Assuming firebase config is here
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button'; // Assuming Button component exists
import { Input } from '@/components/ui/input'; // Assuming Input component exists
import { Label } from '@/components/ui/label'; // Assuming Label component exists

const TempSuperAdminSignup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (email !== "jerome@storypixie.online") {
        setError("This form is only for creating the designated super admin: jerome@storypixie.online");
        return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const timestamp = serverTimestamp() as Timestamp;

        // Ensure this matches your final_user_schema_v3.md structure
        // and includes all necessary fields for a super admin
        const userProfileData = {
          email: user.email || "",
          displayName: user.displayName || user.email?.split('@')[0] || "Super Admin",
          photoURL: user.photoURL || null,
          createdAt: timestamp,
          lastLoginAt: timestamp,
          updatedAt: timestamp,
          isActive: true,
          isEmailVerified: false, // Email will be unverified initially
          isAdmin: true, // CRITICAL for super admin
          roles: ['super-admin', 'admin', 'user'], // Super admin has all roles
          pixieDust: {
            purple: 0,
            gold: 0,
          },
          subscription: {
            status: "premium", // Or appropriate status for super admin
            planId: "super-admin-plan",
            provider: "internal",
            providerSubscriptionId: null,
            currentPeriodStart: timestamp,
            currentPeriodEnd: null, // Or a far future date
            trialEnd: null,
            cancelAtPeriodEnd: false,
            canceledAt: null,
            autoRenew: true,
          },
          purchaseHistory: [],
          isWizardComplete: true, // Assuming admin doesn't need app wizard
          migrationFlags: {},
        };

        await setDoc(userDocRef, userProfileData);
        
        // Create default settings subcollection if needed for admin panel usage
        const settingsDocRef = doc(db, "users", user.uid, "settings", "userSettings");
        const defaultSettings = {
          preferredLanguage: "en", 
          notificationsEnabled: true,
          theme: "system",
        };
        await setDoc(settingsDocRef, defaultSettings);

        alert('Super admin account created successfully! You will be redirected to the login page. Please log in with the credentials.');
        navigate('/login'); // Or your admin panel's login route
      } else {
        setError('Failed to create user details.');
      }
    } catch (err: any) {
      console.error("Super admin signup error:", err);
      setError(err.message || 'Failed to create super admin account.');
    }
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <h2>Temporary Super Admin Signup</h2>
      <p>Use this form ONLY to create the initial super admin: jerome@storypixie.online</p>
      <form onSubmit={handleSignup} style={{ width: '300px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jerome@storypixie.online" required />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <Button type="submit" disabled={loading || email !== "jerome@storypixie.online"}>
          {loading ? 'Creating...' : 'Create Super Admin'}
        </Button>
      </form>
    </div>
  );
};

export default TempSuperAdminSignup;

