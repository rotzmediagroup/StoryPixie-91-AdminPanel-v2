import { useState } from 'react';
import { Bell, Menu, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useLayout } from '@/contexts/LayoutContext';
import { useIsMobile } from '@/hooks/use-mobile';
import logo from "@/assets/logo.png";
import { cn } from '@/lib/utils'; // Added missing import

// Import Sidebar content without the full Sidebar component wrapper
// Assuming SidebarContent exists and is correctly implemented
import { SidebarContent } from './SidebarContent'; 

const Header = () => {
  const { currentUser, logout } = useAuth();
  const { isSidebarOpen, toggleSidebar } = useLayout(); // toggleSidebar might not be used here
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <header className="border-b border-border bg-background sticky top-0 z-10">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center">
          {isMobile && (
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden mr-2">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-[250px]">
                <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
                  {/* Ensure SidebarContent is rendered correctly */}
                  <SidebarContent /> 
                </div>
              </SheetContent>
            </Sheet>
          )}
          
          <div className="h-8 w-auto mr-3 hidden md:block">
            <img 
              src={logo} 
              alt="Story Pixie Logo"
              className="h-full object-contain" 
            />
          </div>
          <h1 className={cn(
            "text-xl font-semibold",
            isMobile ? "text-center" : ""
          )}>Story Pixie Admin</h1>
        </div>

        {/* Search bar - visible on desktop and tablet */}
        <div className="hidden md:block flex-1 px-8 max-w-md mx-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full pl-8 bg-background"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Mobile search button */}
        <Button 
          variant="ghost" 
          size="icon"
          className="md:hidden"
          onClick={() => {
            // TODO: Implement mobile search functionality
            console.log("Open mobile search");
          }}
        >
          <Search className="h-5 w-5" />
        </Button>

        <div className="flex items-center gap-2 sm:gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                {/* Placeholder notification badge */}
                <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]">
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {/* Placeholder notifications */}
              <DropdownMenuItem className="cursor-pointer">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium">Placeholder Alert</p>
                  <p className="text-xs text-muted-foreground">Details about the alert.</p>
                  <p className="text-xs text-muted-foreground">10 minutes ago</p>
                </div>
              </DropdownMenuItem>
              {/* Add more placeholder items or implement real notifications later */}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={currentUser?.profileImage || undefined} alt={currentUser?.name || 'User'} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {currentUser?.name?.charAt(0).toUpperCase() || <User className="h-4 w-4" />}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{currentUser?.name || 'Admin User'}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {currentUser?.email || 'admin@example.com'}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled> {/* Disable until implemented */}
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem disabled> {/* Disable until implemented */}
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="cursor-pointer">
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Mobile search input - logic might need refinement */}
      {/* Consider a dedicated state for mobile search visibility */}
      {/* {isMobile && mobileSearchOpen && ( ... ) } */}
    </header>
  );
};

export default Header;

