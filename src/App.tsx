import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { LayoutProvider } from "@/contexts/LayoutContext";
import AdminLayout from "@/components/layout/AdminLayout";
import Login from "@/pages/Login"; // Reinstated old login component
// import LoginV2 from "@/pages/LoginV2"; // Commented out new login component
import Dashboard from "@/pages/Dashboard";
import UserManagement from "@/pages/UserManagement";
import StoryManagement from "@/pages/StoryManagement";
import ContentModeration from "@/pages/ContentModeration";
import AIModelManagement from "@/pages/AIModelManagement";
import AISettingsPage from "@/pages/AISettings";
import Analytics from "@/pages/Analytics";
import Settings from "@/pages/Settings";
import ActivityLog from "@/pages/ActivityLog";
import SystemHealth from "@/pages/SystemHealth";
import ErrorLog from "@/pages/ErrorLog";
import NotFound from "@/pages/NotFound";
import DebugAuth from "@/pages/DebugAuth";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Simplified Protected route wrapper component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
    </div>;
  }

  if (!isAuthenticated) {
    console.log("ProtectedRoute: Not authenticated, redirecting to /login");
    return <Navigate to="/login" replace />;
  }

  console.log("ProtectedRoute: Authenticated, rendering children");
  return <>{children}</>;
};

// Simplified Public route wrapper component (accessible only if NOT authenticated)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
    </div>;
  }

  if (isAuthenticated) {
    console.log("PublicRoute: Authenticated, redirecting to /");
    return <Navigate to="/" replace />;
  }

  console.log("PublicRoute: Not authenticated, rendering children");
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={
        <PublicRoute>
          <Login /> {/* Use the original Login component */}
        </PublicRoute>
      } />

      {/* Debug route - accessible without authentication */}
      <Route path="/debug-auth" element={
        <DebugAuth />
      } />

      {/* All authenticated routes go under AdminLayout */}
      <Route element={
        <ProtectedRoute>
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route path="/" element={<Dashboard />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/stories" element={<StoryManagement />} />
        <Route path="/moderation" element={<ContentModeration />} />
        <Route path="/content-moderation" element={<Navigate to="/moderation" replace />} />
        <Route path="/ai-models" element={<AIModelManagement />} />
        <Route path="/ai-settings" element={<AISettingsPage />} />
        <Route path="/activity-log" element={<ActivityLog />} />
        <Route path="/system-health" element={<SystemHealth />} />
        <Route path="/error-log" element={<ErrorLog />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* Catch-all 404 route */}
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
