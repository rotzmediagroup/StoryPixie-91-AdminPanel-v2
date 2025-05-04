import React from \'react\';
import { Link, useLocation } from \'react-router-dom\';
import { cn } from \'@/lib/utils\';
import { Button } from \'@/components/ui/button\';
import { ScrollArea } from \'@/components/ui/scroll-area\';
import { Separator } from \'@/components/ui/separator\';
import { useAuth } from \'@/contexts/AuthContext\';
import { Avatar, AvatarFallback, AvatarImage } from \'@/components/ui/avatar\';
import logo from \'@/assets/logo.png\';
import { 
  Users, 
  BarChart3, // Use for Analytics
  Settings, 
  BookOpen, // Use for Story Management
  Wand2, // Use for AI Models
  LogOut,
  ChevronLeft, 
  ChevronRight,
  Gauge, // Use for Dashboard
  Shield // Use for Moderation
} from \'lucide-react\';
import { useLayout } from \'@/contexts/LayoutContext\';
import { useIsMobile } from \'@/hooks/use-mobile\';
import { UserRole } from \'@/types\'; // Assuming UserRole is defined in @/types

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  active?: boolean;
  minimized?: boolean;
  roles?: UserRole[];
}

const NavItem = ({ icon: Icon, label, href, active, minimized, roles = [] }: NavItemProps) => {
  // Simplified: Removed role-based access control for now during rebuild
  // const { hasPermission } = useAuth();
  const { closeSidebar } = useLayout();
  const isMobile = useIsMobile();
  
  // Simplified: Always show item during rebuild
  // const hasRequiredRole = roles.length === 0 || roles.some(role => hasPermission(role));
  // if (!hasRequiredRole) return null;

  // On mobile, close sidebar after navigation
  const handleClick = () => {
    if (isMobile) {
      closeSidebar();
    }
  };

  return (
    <Link to={href} onClick={handleClick}>
      <Button
        variant=\"ghost\"
        className={cn(
          \"w-full flex items-center justify-start gap-3 px-3 py-2 h-10\",
          active ? \"bg-sidebar-accent text-sidebar-accent-foreground\" : \"text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground\",
          minimized && \"justify-center px-2\"
        )}
      >
        <Icon className=\"h-5 w-5\" />
        {!minimized && <span>{label}</span>}
      </Button>
    </Link>
  );
};

export const SidebarContent: React.FC = () => {
  const location = useLocation();
  const { isSidebarOpen, toggleSidebar } = useLayout();
  // Simplified: Removed canManageAdmins for now
  const { currentUser, logout } = useAuth(); 
  const isMobile = useIsMobile();
  
  const isActive = (path: string) => {
    if (path === \'/\') return location.pathname === \'/\';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Logo and Brand */}
      <div className=\"flex items-center px-4 py-4\">
        <div className=\"flex items-center flex-1\">
          <div className=\"h-8 w-auto\">
            <img 
              src={logo} // Use imported logo
              alt=\"Story Pixie Logo\" 
              className=\"h-full object-contain\"
            />
          </div>
          {(isSidebarOpen || isMobile) && (
            <span className=\"text-lg font-medium ml-2 text-sidebar-foreground\">Story Pixie</span>
          )}
        </div>
        {!isMobile && (
          <Button 
            variant=\"ghost\" 
            size=\"icon\" 
            onClick={toggleSidebar}
            className=\"text-sidebar-foreground hover:bg-sidebar-accent\"
          >
            {isSidebarOpen ? (
              <ChevronLeft className=\"h-4 w-4\" />
            ) : (
              <ChevronRight className=\"h-4 w-4\" />
            )}
          </Button>
        )}
      </div>

      <Separator className=\"bg-sidebar-border\" />

      {/* Navigation Links - Updated */}
      <ScrollArea className=\"flex-1 overflow-auto\">
        <div className=\"px-2 py-2 space-y-1\"> {/* Added space-y-1 */}
          <NavItem 
            icon={Gauge} 
            label=\"Dashboard\" 
            href=\"/\" 
            active={isActive(\"/\")} 
            minimized={!isSidebarOpen && !isMobile} 
          />
          <NavItem 
            icon={BarChart3} 
            label=\"Analytics\" 
            href=\"/analytics\" 
            active={isActive(\"/analytics\")} 
            minimized={!isSidebarOpen && !isMobile} 
          />
          <NavItem 
            icon={Users} 
            label=\"Users\" 
            href=\"/users\" 
            active={isActive(\"/users\")} 
            minimized={!isSidebarOpen && !isMobile} 
          /> 
          <NavItem 
            icon={BookOpen} 
            label=\"Stories\" 
            href=\"/stories\" 
            active={isActive(\"/stories\")} 
            minimized={!isSidebarOpen && !isMobile} 
          />
          <NavItem 
            icon={Shield} 
            label=\"Moderation\" 
            href=\"/moderation\" 
            active={isActive(\"/moderation\")} 
            minimized={!isSidebarOpen && !isMobile} 
          />
          <NavItem 
            icon={Wand2} 
            label=\"AI Models\" 
            href=\"/ai-models\" 
            active={isActive(\"/ai-models\")} 
            minimized={!isSidebarOpen && !isMobile} 
          />
           <NavItem 
            icon={Settings} 
            label=\"Settings\" 
            href=\"/settings\" 
            active={isActive(\"/settings\")} 
            minimized={!isSidebarOpen && !isMobile} 
          />
        </div>
      </ScrollArea>

      {/* User Area */}
      <div className=\"mt-auto border-t border-sidebar-border p-2\">
        <div className={cn(
          \"flex items-center gap-2 p-2 rounded-md\",
          (isSidebarOpen || isMobile) ? \"justify-between\" : \"justify-center\"
        )}>
          {(isSidebarOpen || isMobile) && currentUser ? (
            <>
              <div className=\"flex items-center\">
                <Avatar className=\"h-8 w-8\">
                  <AvatarImage src={currentUser.profileImage || undefined} alt={currentUser.name || \'Admin\'} />
                  <AvatarFallback className=\"bg-primary text-primary-foreground\">
                    {currentUser.name?.charAt(0).toUpperCase() || \'A\'}
                  </AvatarFallback>
                </Avatar>
                <div className=\"ml-2\">
                  <p className=\"text-xs font-medium leading-none\">{currentUser.name || \'Admin User\'}</p>
                  {/* Simplified: Removed role display for now */}
                  {/* <p className=\"text-xs text-sidebar-foreground/60\">{currentUser.role.replace(\'_\', \' \')}</p> */}
                </div>
              </div>
              <Button 
                variant=\"ghost\" 
                size=\"icon\" 
                onClick={logout}
                className=\"text-sidebar-foreground hover:bg-sidebar-accent h-8 w-8\"
              >
                <LogOut className=\"h-4 w-4\" />
              </Button>
            </>
          ) : !isMobile ? ( // Show logout icon even when minimized on desktop
            <Button 
              variant=\"ghost\" 
              size=\"icon\" 
              onClick={logout}
              className=\"text-sidebar-foreground hover:bg-sidebar-accent\"
            >
              <LogOut className=\"h-4 w-4\" />
            </Button>
          ) : null /* Don\'t show anything if not logged in on mobile */}
        </div>
      </div>
    </>
  );
};

