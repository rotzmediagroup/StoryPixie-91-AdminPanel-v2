
import React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { SystemHealth, UserStatus } from '@/types';

type StatusBadgeProps = {
  status: SystemHealth['status'] | UserStatus;
};

const StatusBadge = ({ status }: StatusBadgeProps) => {
  let color = '';
  let label = '';

  switch (status) {
    // System health statuses
    case 'operational':
      color = 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-transparent';
      label = 'Operational';
      break;
    case 'degraded':
      color = 'bg-amber-100 text-amber-800 hover:bg-amber-200 border-transparent';
      label = 'Degraded';
      break;
    case 'down':
      color = 'bg-rose-100 text-rose-800 hover:bg-rose-200 border-transparent';
      label = 'Down';
      break;
    
    // User statuses
    case 'active':
      color = 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-transparent';
      label = 'Active';
      break;
    case 'suspended':
      color = 'bg-amber-100 text-amber-800 hover:bg-amber-200 border-transparent';
      label = 'Suspended';
      break;
    case 'blocked':
      color = 'bg-rose-100 text-rose-800 hover:bg-rose-200 border-transparent';
      label = 'Blocked';
      break;
    case 'pending':
      color = 'bg-blue-100 text-blue-800 hover:bg-blue-200 border-transparent';
      label = 'Pending';
      break;
    
    // Default case
    default:
      color = 'bg-slate-100 text-slate-800 border-transparent';
      label = 'Unknown';
  }

  return (
    <Badge className={cn(color)} variant="outline">
      {label}
    </Badge>
  );
};

export default StatusBadge;
