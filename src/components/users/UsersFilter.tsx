
import { UserPlatform } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Search, Filter, RefreshCw, FileDown, Plus } from 'lucide-react';

interface UsersFilterProps {
  searchQuery: string;
  selectedPlatform: UserPlatform | 'all';
  onSearchChange: (value: string) => void;
  onPlatformChange: (platform: UserPlatform | 'all') => void;
}

const UsersFilter = ({
  searchQuery,
  selectedPlatform,
  onSearchChange,
  onPlatformChange
}: UsersFilterProps) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search users..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2 w-full sm:w-auto">
              <Filter className="h-4 w-4" />
              Platform: {selectedPlatform === 'all' ? 'All' : selectedPlatform}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Filter by Platform</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onPlatformChange('all')}>All</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onPlatformChange('web')}>Web</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onPlatformChange('ios')}>iOS</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onPlatformChange('android')}>Android</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <Button variant="outline" size="icon" className="sm:flex-none">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="sm:flex-none">
            <FileDown className="h-4 w-4" />
          </Button>
          <Button className="pixie-gradient hover:opacity-90 gap-2 flex-1 sm:flex-none">
            <Plus className="h-4 w-4" />
            <span>Add User</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UsersFilter;
