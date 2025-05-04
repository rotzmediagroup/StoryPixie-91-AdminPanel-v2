import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { getAllUsers } from '@/lib/firestoreUtils'; // Use getAllUsers
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table'; // Import the new DataTable component
import { userColumns } from '@/components/users/columns'; // Import the column definitions
import { User } from '@/types'; // Assuming User type is defined

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const allUsers = await getAllUsers();
        setUsers(allUsers);
      } catch (err: any) {
        console.error("Error fetching user data:", err);
        setError(err.message || 'Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <DashboardHeader 
        title="User Management" 
        description="View, search, filter, and manage StoryPixie users." 
      />

      {loading && (
        <div className="flex justify-center items-center h-[40vh]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
            <p className="text-muted-foreground">Loading user data...</p>
          </div>
        </div>
      )}

      {error && (
        <Card className="bg-destructive/10 border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error Loading Data</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
        </Card>
      )}

      {!loading && !error && (
        <Card>
          <CardHeader>
            <CardTitle>All Users ({users.length})</CardTitle>
            {/* Toolbar and other controls will be inside DataTable */}
          </CardHeader>
          <CardContent>
            <DataTable columns={userColumns} data={users} />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UserManagement;

