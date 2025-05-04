import React, { useState, useEffect } from 'react';
import { Loader2, Users } from 'lucide-react';
import { getUserCount, getUserSample } from '@/lib/firestoreUtils';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';

const UserManagement = () => {
  const [userCount, setUserCount] = useState<number | null>(null);
  const [userSample, setUserSample] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const count = await getUserCount();
        const sample = await getUserSample(10); // Fetch 10 sample users
        setUserCount(count);
        setUserSample(sample);
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
        description="View and manage StoryPixie users." 
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
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {userCount !== null && userCount >= 0 ? userCount.toLocaleString() : 'N/A'}
              </div>
              <p className="text-xs text-muted-foreground">
                Total registered users in the platform.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>User Sample (First 10)</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User ID</TableHead>
                      <TableHead>Email</TableHead>
                      {/* Add more relevant columns based on available data */}
                      {/* <TableHead>Name</TableHead> */}
                      {/* <TableHead>Registration Date</TableHead> */}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userSample.length > 0 ? (
                      userSample.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.id}</TableCell>
                          <TableCell>{user.email || 'N/A'}</TableCell>
                          {/* <TableCell>{user.name || 'N/A'}</TableCell> */}
                          {/* <TableCell>{user.registrationDate ? new Date(user.registrationDate).toLocaleDateString() : 'N/A'}</TableCell> */}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={2} className="h-24 text-center">
                          No user sample data available.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default UserManagement;

