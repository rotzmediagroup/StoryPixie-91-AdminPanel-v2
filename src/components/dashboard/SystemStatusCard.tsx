
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database } from 'lucide-react';
import StatusBadge from '@/components/dashboard/StatusBadge';
import { SystemHealth } from '@/types';

interface SystemStatusCardProps {
  healthData: SystemHealth[];
}

const SystemStatusCard: React.FC<SystemStatusCardProps> = ({ healthData }) => {
  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle>System Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {healthData.map((service) => (
            <div key={service.service} className="flex items-center justify-between p-3 bg-background rounded-lg border">
              <div className="flex items-center">
                <Database className="h-4 w-4 text-muted-foreground mr-2" />
                <span>{service.service}</span>
              </div>
              <div className="flex items-center gap-2">
                {service.responseTime && (
                  <span className="text-xs text-muted-foreground">{service.responseTime}ms</span>
                )}
                <StatusBadge status={service.status} />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemStatusCard;
