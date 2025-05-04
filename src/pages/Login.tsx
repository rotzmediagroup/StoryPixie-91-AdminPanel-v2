import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast'; // Changed import path

// Import components
import LoginForm from '@/components/auth/LoginForm';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  
  const { login, isAuthenticated, isLoading: isAuthLoading } = useAuth(); // Use isAuthenticated and isLoading from context
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      console.log('[Login] Already authenticated, redirecting to /');
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError(null);

    try {
      console.log('[Login] Attempting login with:', email);
      const result = await login(email, password);

      if (result.success) {
        console.log('[Login] Login successful (Firebase auth done, listener will handle state)');
        // No need to navigate here, the ProtectedRoute/PublicRoute will handle redirection
        // based on the updated isAuthenticated state from the listener.
        toast({
          title: "Login Initiated",
          description: "Checking credentials...",
        });
      } else {
        console.log('[Login] Login failed:', result.error);
        setAuthError(result.error || "Invalid email or password. Please try again.");
      }
    } catch (error) {
      console.error('[Login] Unexpected login error:', error);
      setAuthError((error as Error).message || "An unexpected error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  // If auth state is still loading, show a simple loading indicator
  if (isAuthLoading) {
     return <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
    </div>;
  }

  // Show login form
  return (
    <LoginForm
      email={email}
      password={password}
      isLoading={isLoading} // Use local loading state for the form submission itself
      authError={authError}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      onSubmit={handleSubmit}
    />
  );
};

export default Login;

