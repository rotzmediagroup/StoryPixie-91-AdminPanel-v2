
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface LoginFormProps {
  email: string;
  password: string;
  isLoading: boolean;
  authError: string | null;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const LoginForm = ({
  email,
  password,
  isLoading,
  authError,
  onEmailChange,
  onPasswordChange,
  onSubmit
}: LoginFormProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 py-8">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="w-32 sm:w-40">
              <img 
                src="/lovable-uploads/da8a1305-1c08-45c1-b924-b18e1134d27f.png" 
                alt="Story Pixie Logo"
                className="w-full object-contain" 
              />
            </div>
          </div>
          <h2 className="mt-4 text-2xl sm:text-3xl font-bold">Story Pixie Admin</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to access your admin panel
          </p>
        </div>

        <Card className="shadow-md">
          <form onSubmit={onSubmit}>
            <CardHeader>
              <CardTitle>Admin Login</CardTitle>
              <CardDescription>Enter your email and password to sign in</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {authError && (
                <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  <span>{authError}</span>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => onEmailChange(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => onPasswordChange(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full pixie-gradient hover:opacity-90"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default LoginForm;
