import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, 
  BarChart3, 
  Settings, 
  BookOpen, 
  Activity, 
  Wand2, 
  LogOut,
  ChevronLeft, 
  ChevronRight,
  Database,
  Gauge,
  Shield
} from 'lucide-react';
import { useLayout } from '@/contexts/LayoutContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { UserRole } from '@/types';

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  active?: boolean;
  minimized?: boolean;
  roles?: UserRole[];
}

const NavItem = ({ icon: Icon, label, href, active, minimized, roles = [] }: NavItemProps) => {
  const { hasPermission } = useAuth();
  const { closeSidebar } = useLayout();
  const isMobile = useIsMobile();
  
  // Check if user has any of the required roles
  const hasRequiredRole = roles.length === 0 || roles.some(role => hasPermission(role));
  
  if (!hasRequiredRole) return null;

  // On mobile, close sidebar after navigation
  const handleClick = () => {
    if (isMobile) {
      closeSidebar();
    }
  };

  return (
    <Link to={href} onClick={handleClick}>
      <Button
        variant="ghost"
        className={cn(
          "w-full flex items-center justify-start gap-3 px-3 py-2 h-10",
          active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
          minimized && "justify-center px-2"
        )}
      >
        <Icon className="h-5 w-5" />
        {!minimized && <span>{label}</span>}
      </Button>
    </Link>
  );
};

export const SidebarContent: React.FC = () => {
  const location = useLocation();
  const { isSidebarOpen, toggleSidebar } = useLayout();
  const { currentUser, logout, canManageAdmins } = useAuth();
  const isMobile = useIsMobile();
  
  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Logo and Brand */}
      <div className="flex items-center px-4 py-4">
        <div className="flex items-center flex-1">
          <div className="h-8 w-auto">
            <img 
              src="/lovable-uploads/da8a1305-1c08-45c1-b924-b18e1134d27f.png" 
              alt="Story Pixie Logo" 
              className="h-full object-contain"
            />
          </div>
          {(isSidebarOpen || isMobile) && (
            <span className="text-lg font-medium ml-2 text-sidebar-foreground">Story Pixie</span>
          )}
        </div>
        {!isMobile && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            className="text-sidebar-foreground hover:bg-sidebar-accent"
          >
            {isSidebarOpen ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>

      <Separator className="bg-sidebar-border" />

      {/* Navigation Links */}
      <ScrollArea className="flex-1 overflow-auto">
        <div className="px-2 py-2">
          <NavItem 
            icon={Gauge} 
            label="Dashboard" 
            href="/" 
            active={isActive('/')} 
            minimized={!isSidebarOpen && !isMobile} 
          />
          <NavItem 
            icon={Users} 
            label="User Management" 
            href="/users" 
            active={isActive('/users')} 
            minimized={!isSidebarOpen && !isMobile} 
            roles={['super_admin', 'admin', 'support_staff']} 
          />
          {canManageAdmins() && (
            <NavItem 
              icon={Shield} 
              label="Admin Management" 
              href="/admin-users" 
              active={isActive('/admin-users')} 
              minimized={!isSidebarOpen && !isMobile} 
              roles={['super_admin']} 
            />
          )}
          <NavItem 
            icon={Wand2} 
            label="AI Services" 
            href="/ai-services" 
            active={isActive('/ai-services')} 
            minimized={!isSidebarOpen && !isMobile}
            roles={['super_admin', 'admin', 'content_moderator']} 
          />
          <NavItem 
            icon={BookOpen} 
            label="Content" 
            href="/content" 
            active={isActive('/content')} 
            minimized={!isSidebarOpen && !isMobile} 
            roles={['super_admin', 'admin', 'content_moderator']} 
          />
          <NavItem 
            icon={Activity} 
            label="System Health" 
            href="/system" 
            active={isActive('/system')} 
            minimized={!isSidebarOpen && !isMobile} 
            roles={['super_admin', 'admin']} 
          />
          <NavItem 
            icon={BarChart3} 
            label="Analytics" 
            href="/analytics" 
            active={isActive('/analytics')} 
            minimized={!isSidebarOpen && !isMobile} 
            roles={['super_admin', 'admin', 'analytics_viewer']} 
          />
          <NavItem 
            icon={Database} 
            label="Configuration" 
            href="/config" 
            active={isActive('/config')} 
            minimized={!isSidebarOpen && !isMobile} 
            roles={['super_admin']} 
          />
          <NavItem 
            icon={Settings} 
            label="Settings" 
            href="/settings" 
            active={isActive('/settings')} 
            minimized={!isSidebarOpen && !isMobile} 
          />
        </div>
      </ScrollArea>

      {/* User Area */}
      <div className="mt-auto border-t border-sidebar-border p-2">
        <div className={cn(
          "flex items-center gap-2 p-2 rounded-md",
          (isSidebarOpen || isMobile) ? "justify-between" : "justify-center"
        )}>
          {(isSidebarOpen || isMobile) && currentUser ? (
            <>
              <div className="flex items-center">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={currentUser.profileImage} alt={currentUser.name} />
                  <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground">
                    {currentUser.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-2">
                  <p className="text-xs font-medium leading-none">{currentUser.name}</p>
                  <p className="text-xs text-sidebar-foreground/60">{currentUser.role.replace('_', ' ')}</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={logout}
                className="text-sidebar-foreground hover:bg-sidebar-accent h-8 w-8"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={logout}
              className="text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </>
  );
};
