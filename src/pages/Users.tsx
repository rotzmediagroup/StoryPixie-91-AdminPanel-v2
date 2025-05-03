
import { useState } from 'react';
import { UserPlatform } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { useUsers } from '@/hooks/useUsers';

// Import refactored components
import UserCard from '@/components/users/UserCard';
import UsersTable from '@/components/users/UsersTable';
import UsersFilter from '@/components/users/UsersFilter';
import { Loader2 } from 'lucide-react';

const Users = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<UserPlatform | 'all'>('all');
  const isMobile = useIsMobile();
  
  const { users, loading, error } = useUsers({
    searchQuery,
    filterByPlatform: selectedPlatform === 'all' ? undefined : selectedPlatform,
    limitCount: 100
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">Users</h2>
        <p className="text-muted-foreground">Manage and view user accounts across all platforms</p>
      </div>

      <UsersFilter
        searchQuery={searchQuery}
        selectedPlatform={selectedPlatform}
        onSearchChange={setSearchQuery}
        onPlatformChange={setSelectedPlatform}
      />

      {loading ? (
        <div className="text-center py-8 border rounded-lg bg-background">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
          <p className="text-muted-foreground">Loading users data...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8 border rounded-lg bg-background">
          <p className="text-destructive">{error}</p>
        </div>
      ) : (
        <>
          {isMobile ? (
            // Mobile view - cards
            <div>
              {users.map((user) => (
                <UserCard key={user.id} user={user} />
              ))}
            </div>
          ) : (
            // Desktop/Tablet view - table
            <UsersTable users={users} />
          )}
          
          {users.length === 0 && (
            <div className="text-center py-8 border rounded-lg bg-background">
              <p className="text-muted-foreground">No users found matching your search criteria</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Users;
