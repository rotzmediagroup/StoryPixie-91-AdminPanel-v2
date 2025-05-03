import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { LayoutProvider } from "@/contexts/LayoutContext";
import AdminLayout from "@/components/layout/AdminLayout";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Users from "@/pages/Users";
import AdminUsers from "@/pages/AdminUsers";
import AIServices from "@/pages/AIServices";
import Content from "@/pages/Content";
import SystemHealth from "@/pages/SystemHealth";
import Analytics from "@/pages/Analytics";
import Configuration from "@/pages/Configuration";
import Settings from "@/pages/Settings";
import DatabaseExplorer from "@/pages/DatabaseExplorer";
import NotFound from "@/pages/NotFound";
import { UserRole } from '@/types';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Protected route wrapper component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isFirstTimeLogin } = useAuth();

  // If user needs to complete first-time setup, redirect to login
  if (isFirstTimeLogin) {
    return <Navigate to="/login" />;
  }

  // If user is not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

// Role-protected route wrapper component
const RoleProtectedRoute = ({ children, requiredRole }: { children: React.ReactNode, requiredRole: UserRole }) => {
  const { isAuthenticated, hasPermission, isFirstTimeLogin } = useAuth();

  // If user needs to complete first-time setup, redirect to login
  if (isFirstTimeLogin) {
    return <Navigate to="/login" />;
  }

  // If user is not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // If user doesn't have required role, redirect to dashboard
  if (!hasPermission(requiredRole)) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

// Public route wrapper component (accessible only if NOT authenticated)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isFirstTimeLogin } = useAuth();

  // Allow access if first-time setup is needed, regardless of auth status
  if (isFirstTimeLogin) {
    return <>{children}</>;
  }

  // If already authenticated (and not first login), redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      } />

      <Route element={
        <ProtectedRoute>
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route path="/" element={<Dashboard />} />
        <Route path="/users" element={<Users />} />
        <Route path="/admin-users" element={
          <RoleProtectedRoute requiredRole="super_admin">
            <AdminUsers />
          </RoleProtectedRoute>
        } />
        <Route path="/ai-services" element={<AIServices />} />
        <Route path="/content" element={<Content />} />
        <Route path="/system" element={<SystemHealth />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/config" element={<Configuration />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/database" element={<DatabaseExplorer />} />
      </Route>
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <LayoutProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </LayoutProvider>
      </AuthProvider>
      <Toaster />
      <Sonner />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
