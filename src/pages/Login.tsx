
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

// Import components
import LoginForm from '@/components/auth/LoginForm';
import TwoFactorAuthForm from '@/components/auth/TwoFactorAuthForm';
import FirstTimeSetupWizard from '@/components/auth/FirstTimeSetupWizard';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  
  const { 
    login, 
    completeLogin, 
    currentUser, 
    isFirstTimeLogin,
    pendingUserId,
    pendingUserEmail
  } = useAuth();
  
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError(null);

    try {
      console.log('Attempting login with:', email);
      const { success, requiresTwoFactor, userId } = await login(email, password);

      if (success) {
        if (requiresTwoFactor && userId) {
          console.log('2FA required for user:', userId);
          // User needs to complete 2FA
          setShowTwoFactor(true);
        } else {
          // No 2FA required, proceed with login
          toast({
            title: "Login successful",
            description: "Welcome to Story Pixie Admin Panel",
          });
          
          navigate('/');
        }
      } else {
        setAuthError("Invalid email or password. Please try again.");
      }
    } catch (error) {
      console.error('Login error:', error);
      setAuthError((error as Error).message || "An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTwoFactorCancel = () => {
    setShowTwoFactor(false);
    setAuthError("Two-factor authentication was cancelled.");
  };

  const handleTwoFactorSuccess = () => {
    completeLogin();
  };

  // Show first-time setup wizard for new users
  if (isFirstTimeLogin && pendingUserId && pendingUserEmail) {
    return (
      <FirstTimeSetupWizard 
        userId={pendingUserId} 
        userEmail={pendingUserEmail}
      />
    );
  }

  // Show 2FA form if needed
  if (showTwoFactor && pendingUserId) {
    return (
      <TwoFactorAuthForm 
        pendingUserId={pendingUserId} 
        onCancel={handleTwoFactorCancel}
        onSuccess={handleTwoFactorSuccess}
      />
    );
  }

  // Show login form
  return (
    <LoginForm
      email={email}
      password={password}
      isLoading={isLoading}
      authError={authError}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      onSubmit={handleSubmit}
    />
  );
};

export default Login;
