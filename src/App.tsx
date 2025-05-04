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
import UserManagement from "@/pages/UserManagement";
import StoryManagement from "@/pages/StoryManagement"; // Added import
import ContentModeration from "@/pages/ContentModeration"; // Added import
import AIModelManagement from "@/pages/AIModelManagement"; // Added import
import Analytics from "@/pages/Analytics"; // Added import
import Settings from "@/pages/Settings"; // Added import
import NotFound from "@/pages/NotFound";

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
  const { isAuthenticated, isLoading } = useAuth(); // Added isLoading

  if (isLoading) {
    // Optional: Show a loading indicator while checking auth state
    return <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
    </div>;
  }

  // If user is not authenticated, redirect to login
  if (!isAuthenticated) {
    console.log("ProtectedRoute: Not authenticated, redirecting to /login");
    return <Navigate to="/login" replace />;
  }

  console.log("ProtectedRoute: Authenticated, rendering children");
  return <>{children}</>;
};

// Simplified Public route wrapper component (accessible only if NOT authenticated)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth(); // Added isLoading

  if (isLoading) {
    // Optional: Show a loading indicator while checking auth state
    return <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
    </div>;
  }

  // If already authenticated, redirect to dashboard
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
          <Login />
        </PublicRoute>
      } />

      {/* All authenticated routes go under AdminLayout */}
      <Route element={
        <ProtectedRoute>
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route path="/" element={<Dashboard />} />
        <Route path="/analytics" element={<Analytics />} /> {/* Added route */}
        <Route path="/users" element={<UserManagement />} />
        <Route path="/stories" element={<StoryManagement />} /> {/* Added route */}
        <Route path="/moderation" element={<ContentModeration />} /> {/* Added route */}
        <Route path="/ai-models" element={<AIModelManagement />} /> {/* Added route */}
        <Route path="/settings" element={<Settings />} /> {/* Added route */}
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

