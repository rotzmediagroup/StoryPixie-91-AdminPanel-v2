
import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Search, MoreHorizontal, Plus, RefreshCw, User, Mail, Shield, Clock, History } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { AdminUser, UserRole, AdminActivityLog } from '@/types';
import { getAdminUsers, removeAdminUser, getAdminActivityLogs, getAdminLoginHistory } from '@/utils/adminUsersHelpers';
import { useEffect } from 'react';
import InviteAdminForm from '@/components/admin/InviteAdminForm';
import AddAdminForm from '@/components/admin/AddAdminForm';

const AdminUsers = () => {
  const { currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [activityLogs, setActivityLogs] = useState<AdminActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  const [loginHistory, setLoginHistory] = useState<AdminActivityLog[]>([]);
  const [tabValue, setTabValue] = useState("users");
  const isMobile = useIsMobile();

  // Fetch admin users on component mount
  useEffect(() => {
    fetchAdminUsers();
    fetchActivityLogs();
  }, []);

  const fetchAdminUsers = async () => {
    setLoading(true);
    const users = await getAdminUsers();
    setAdminUsers(users);
    setLoading(false);
  };

  const fetchActivityLogs = async () => {
    const logs = await getAdminActivityLogs();
    setActivityLogs(logs);
  };

  const handleViewLoginHistory = async (user: AdminUser) => {
    setSelectedUser(user);
    const history = await getAdminLoginHistory(user.id);
    setLoginHistory(history);
    setShowHistoryDialog(true);
  };

  const handleRemoveUser = async (user: AdminUser) => {
    if (!currentUser) return;
    
    // Don't allow removing yourself
    if (user.id === currentUser.id) {
      toast({
        title: "Action not allowed",
        description: "You cannot remove your own admin account.",
        variant: "destructive"
      });
      return;
    }
    
    if (confirm(`Are you sure you want to remove ${user.name} (${user.email}) as an admin?`)) {
      const success = await removeAdminUser(user.id, currentUser.id, currentUser.email);
      if (success) {
        fetchAdminUsers();
        toast({
          title: "Admin removed",
          description: `${user.name} has been removed from admin users.`,
          variant: "default"
        });
      }
    }
  };

  const filteredAdminUsers = adminUsers.filter(user => 
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleBadge = (role: UserRole) => {
    const roleColors: Record<string, string> = {
      'super_admin': 'bg-rose-100 text-rose-700',
      'admin': 'bg-purple-100 text-purple-700',
      'content_moderator': 'bg-emerald-100 text-emerald-700',
      'support_staff': 'bg-sky-100 text-sky-700',
      'analytics_viewer': 'bg-amber-100 text-amber-700',
      'observer': 'bg-slate-100 text-slate-700'
    };

    return (
      <Badge className={`${roleColors[role] || 'bg-slate-100 text-slate-700'} border-transparent`}>
        {role.replace('_', ' ')}
      </Badge>
    );
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    try {
      return format(new Date(dateString), 'MMM d, yyyy, h:mm a');
    } catch (error) {
      return dateString;
    }
  };

  // Admin user card view for mobile
  const AdminUserCard = ({ user }: { user: AdminUser }) => (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={user.profileImage} />
              <AvatarFallback className="bg-indigo-200">
                {user.name?.charAt(0) || user.email.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-base">{user.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleViewLoginHistory(user)}>
                <History className="h-4 w-4 mr-2" />
                Login History
              </DropdownMenuItem>
              {user.id !== currentUser?.id && (
                <DropdownMenuItem 
                  className="text-rose-600" 
                  onClick={() => handleRemoveUser(user)}
                >
                  <User className="h-4 w-4 mr-2" />
                  Remove Admin
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-y-2 text-sm">
          <div className="text-muted-foreground">Role:</div>
          <div>{getRoleBadge(user.role)}</div>
          
          <div className="text-muted-foreground">Last Login:</div>
          <div>{formatDate(user.lastLogin)}</div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">Admin Management</h2>
        <p className="text-muted-foreground">Manage admin access and permissions</p>
      </div>

      <Tabs value={tabValue} onValueChange={setTabValue} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="users">Admin Users</TabsTrigger>
          <TabsTrigger value="activity">Activity Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-6 space-y-6">
          <div className="flex flex-col gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search administrators..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex gap-2 w-full sm:w-auto justify-between sm:justify-end">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="sm:flex-none"
                  onClick={fetchAdminUsers}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <Button 
                  onClick={() => setShowInviteDialog(true)}
                  variant="outline" 
                  className="flex-1 sm:flex-none gap-2"
                >
                  <Mail className="h-4 w-4" />
                  <span>Invite Admin</span>
                </Button>
                <Button 
                  onClick={() => setShowAddDialog(true)}
                  className="pixie-gradient hover:opacity-90 gap-2 flex-1 sm:flex-none"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Admin</span>
                </Button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8 border rounded-lg bg-background">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Loading admin users...</p>
            </div>
          ) : (
            <>
              {isMobile ? (
                // Mobile view - cards
                <div>
                  {filteredAdminUsers.map((user) => (
                    <AdminUserCard key={user.id} user={user} />
                  ))}
                </div>
              ) : (
                // Desktop/Tablet view - table
                <div className="bg-background border rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Administrator</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Last Login</TableHead>
                          <TableHead className="w-[80px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredAdminUsers.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarImage src={user.profileImage} />
                                  <AvatarFallback className="bg-indigo-200">
                                    {user.name?.charAt(0) || user.email.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{user.name}</div>
                                  <div className="text-sm text-muted-foreground">{user.email}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{getRoleBadge(user.role)}</TableCell>
                            <TableCell>{formatDate(user.lastLogin)}</TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => handleViewLoginHistory(user)}>
                                    <History className="h-4 w-4 mr-2" />
                                    Login History
                                  </DropdownMenuItem>
                                  {user.id !== currentUser?.id && (
                                    <DropdownMenuItem 
                                      className="text-rose-600" 
                                      onClick={() => handleRemoveUser(user)}
                                    >
                                      <User className="h-4 w-4 mr-2" />
                                      Remove Admin
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
              
              {filteredAdminUsers.length === 0 && (
                <div className="text-center py-8 border rounded-lg bg-background">
                  <Shield className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No admin users found matching your search criteria</p>
                </div>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="activity" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Admin Activity Log</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-2"
                  onClick={fetchActivityLogs}
                >
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Time</TableHead>
                      <TableHead>Admin</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>IP Address</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activityLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>{formatDate(log.timestamp)}</TableCell>
                        <TableCell>{log.adminEmail}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {log.action.replace(/_/g, ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>{log.ipAddress || 'Unknown'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              {activityLogs.length === 0 && (
                <div className="text-center py-8">
                  <History className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No activity logs found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Admin Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Admin</DialogTitle>
            <DialogDescription>
              Create a new admin account with direct access.
            </DialogDescription>
          </DialogHeader>
          <AddAdminForm 
            currentAdminId={currentUser?.id || ''} 
            currentAdminEmail={currentUser?.email || ''} 
            onSuccess={() => {
              setShowAddDialog(false);
              fetchAdminUsers();
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Invite Admin Dialog */}
      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Invite New Admin</DialogTitle>
            <DialogDescription>
              Send an invitation email to a new admin user.
            </DialogDescription>
          </DialogHeader>
          <InviteAdminForm 
            currentAdminId={currentUser?.id || ''} 
            currentAdminEmail={currentUser?.email || ''} 
            onSuccess={() => {
              setShowInviteDialog(false);
              fetchAdminUsers();
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Login History Dialog */}
      <Dialog open={showHistoryDialog} onOpenChange={setShowHistoryDialog}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Login History for {selectedUser?.name}</DialogTitle>
            <DialogDescription>
              Recent login activity for this administrator
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>User Agent</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loginHistory.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="whitespace-nowrap">{formatDate(log.timestamp)}</TableCell>
                    <TableCell>{log.ipAddress || 'Unknown'}</TableCell>
                    <TableCell className="max-w-[200px] truncate text-xs">
                      {log.userAgent || 'Unknown'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {loginHistory.length === 0 && (
              <div className="text-center py-8">
                <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">No login history found</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowHistoryDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsers;
