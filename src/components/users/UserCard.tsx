
import { User, UserPlatform } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User as UserIcon, MoreHorizontal } from 'lucide-react';
import StatusBadge from '@/components/dashboard/StatusBadge';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';

interface UserCardProps {
  user: User;
}

const UserCard = ({ user }: UserCardProps) => {
  const getPlatformBadge = (platform: UserPlatform | UserPlatform[]) => {
    const platformColors: Record<UserPlatform, string> = {
      web: 'bg-blue-100 text-blue-700',
      ios: 'bg-purple-100 text-purple-700',
      android: 'bg-green-100 text-green-700'
    };

    if (Array.isArray(platform)) {
      return (
        <div className="flex gap-1">
          {platform.map((p) => (
            <Badge key={p} className={`${platformColors[p]} border-transparent`}>
              {p}
            </Badge>
          ))}
        </div>
      );
    }

    return (
      <Badge className={`${platformColors[platform]} border-transparent`}>
        {platform}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={user.profileImage} />
              <AvatarFallback className="bg-pixie-200">
                <UserIcon className="h-4 w-4" />
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
              <DropdownMenuItem>View Profile</DropdownMenuItem>
              <DropdownMenuItem>Edit User</DropdownMenuItem>
              <DropdownMenuItem>Add Credits</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-rose-600">Suspend User</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-y-2 text-sm">
          <div className="text-muted-foreground">Registered:</div>
          <div>{formatDate(user.registrationDate)}</div>
          
          <div className="text-muted-foreground">Platform:</div>
          <div>{getPlatformBadge(user.platform)}</div>
          
          <div className="text-muted-foreground">Credits:</div>
          <div>{user.credits}</div>
          
          <div className="text-muted-foreground">Status:</div>
          <div><StatusBadge status={user.status} /></div>
          
          <div className="text-muted-foreground">Last Active:</div>
          <div>{formatDate(user.lastLoginDate)}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserCard;
