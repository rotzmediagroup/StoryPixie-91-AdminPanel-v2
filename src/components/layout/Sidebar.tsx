import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useLayout } from '@/contexts/LayoutContext';
import { SidebarContent } from './SidebarContent';
import { Wifi, WifiOff, Loader2 } from 'lucide-react';
import { 
  pingFirebase, 
  testFirestoreConnection, 
  testAuthConnection,
  listUsersFromDatabase
} from '@/utils/serviceAccountAuth';
import { useAuth } from '@/contexts/AuthContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from '@/components/ui/use-toast';

const Sidebar = () => {
  const { isSidebarOpen } = useLayout();
  const { isAuthenticated } = useAuth();
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [connectionDetails, setConnectionDetails] = useState<{
    firestore: boolean;
    auth: boolean;
  }>({ firestore: false, auth: false });
  const [databaseInfo, setDatabaseInfo] = useState<Record<string, unknown> | null>(null);
  
  const checkConnection = async (showToast = false) => {
    if (!isAuthenticated) return;
    
    setConnectionStatus('checking');
    try {
      console.log('Checking StoryPixie Firebase connection status with updated configuration...');
      
      // Try each individual connection test
      const firestoreConnected = await testFirestoreConnection();
      const authConnected = await testAuthConnection();
      
      setConnectionDetails({
        firestore: firestoreConnected,
        auth: authConnected
      });
      
      const isAnyConnected = firestoreConnected || authConnected;
      
      console.log('Firebase connection check results:', {
        firestore: firestoreConnected,
        auth: authConnected,
        isAnyConnected
      });
      
      setConnectionStatus(isAnyConnected ? 'connected' : 'disconnected');
      setLastChecked(new Date());
      
      // Try to get database user information
      if (isAnyConnected) {
        console.log('Attempting to retrieve user data from database...');
        const usersData = await listUsersFromDatabase();
        setDatabaseInfo(usersData);
        console.log('Database user info:', usersData);
        
        // Show toast only for manual checks and only if requested
        if (showToast) {
          toast({
            title: "Firebase Connection",
            description: "Connection check completed.",
            variant: "default"
          });
        }
      } else {
        if (showToast) {
          toast({
            title: "Firebase Connection Error",
            description: "Could not connect to any StoryPixie Firebase services.",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      console.error('Connection check error:', error);
      setConnectionStatus('disconnected');
      setLastChecked(new Date());
      if (showToast) {
        toast({
          title: "Connection Error",
          description: "Failed to check Firebase connection: " + (error as Error).message,
          variant: "destructive"
        });
      }
    }
  };
  
  useEffect(() => {
    // Only check connection if authenticated
    if (isAuthenticated) {
      checkConnection(false); // Initial check, don't show toast
      
      // Recheck connection periodically
      const interval = setInterval(() => checkConnection(false), 60000); // Check every minute
      
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);
  
  // Format the last checked time
  const formatLastChecked = () => {
    if (!lastChecked) return 'Not checked yet';
    
    return lastChecked.toLocaleTimeString();
  };
  
  const handleManualCheck = async () => {
    await checkConnection(true); // Manual check, show toast
  };
  
  // Format database info for display
  const formatDatabaseInfo = () => {
    if (!databaseInfo) return "No data retrieved";
    
    if (databaseInfo.error) {
      return `Error: ${databaseInfo.error}`;
    }
    
    if (databaseInfo.source === 'firestore') {
      const collection = databaseInfo.collection || 'unknown collection';
      const userCount = Array.isArray(databaseInfo.data) ? databaseInfo.data.length : 0;
      return `Found ${userCount} users in Firestore collection '${collection}'`;
    }
    
    return "Connected, but no specific user data found";
  };
  
  return (
    <div
      className={cn(
        "border-r border-sidebar-border flex flex-col bg-sidebar text-sidebar-foreground h-screen transition-all duration-300 ease-in-out",
        isSidebarOpen ? "w-64" : "w-16"
      )}
    >
      {/* Connection status indicator - only show when authenticated */}
      {isAuthenticated && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div 
                className={cn(
                  "px-3 py-2 flex items-center gap-2 border-b border-sidebar-border cursor-pointer",
                  !isSidebarOpen && "justify-center",
                  connectionStatus === 'connected' ? "bg-green-500/10" : 
                  connectionStatus === 'disconnected' ? "bg-red-500/10" : ""
                )}
                onClick={handleManualCheck}
              >
                {connectionStatus === 'connected' ? (
                  <>
                    <Wifi className="h-4 w-4 text-green-500" />
                    {isSidebarOpen && <span className="text-xs text-green-500">Firebase Connected</span>}
                  </>
                ) : connectionStatus === 'disconnected' ? (
                  <>
                    <WifiOff className="h-4 w-4 text-red-500" />
                    {isSidebarOpen && <span className="text-xs text-red-500">Connection Error</span>}
                  </>
                ) : (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {isSidebarOpen && <span className="text-xs">Checking...</span>}
                  </>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" className="max-w-xs">
              <div className="space-y-1">
                <p className="font-medium">StoryPixie Firebase Connection</p>
                <p>Status: {connectionStatus === 'connected' ? 'Connected ✅' : 
                           connectionStatus === 'disconnected' ? 'Disconnected ❌' : 
                           'Checking...'}
                </p>
                <div className="text-xs space-y-1 mt-1">
                  <p>Firestore: {connectionDetails.firestore ? '✅ Connected' : '❌ Disconnected'}</p>
                  <p>Authentication: {connectionDetails.auth ? '✅ Connected' : '❌ Disconnected'}</p>
                </div>
                <p className="text-xs mt-1">Database: {formatDatabaseInfo()}</p>
                <p className="text-xs">Last checked: {formatLastChecked()}</p>
                <p className="text-xs italic">Click to check again</p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      
      <SidebarContent />
    </div>
  );
};

export default Sidebar;
