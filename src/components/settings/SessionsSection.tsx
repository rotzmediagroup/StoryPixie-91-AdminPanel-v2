
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from '@/hooks/use-toast';
import { History, Laptop, Smartphone, Globe } from 'lucide-react';

const SessionsSection = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <History className="h-5 w-5" />
          <CardTitle>Active Sessions</CardTitle>
        </div>
        <CardDescription>
          Manage your current login sessions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="border rounded-md overflow-hidden">
            <div className="bg-muted/50 p-3">
              <div className="grid grid-cols-5 gap-4 font-medium text-sm">
                <div>Device</div>
                <div>Location</div>
                <div>IP Address</div>
                <div>Last Active</div>
                <div></div>
              </div>
            </div>
            
            <div className="divide-y">
              <div className="p-3">
                <div className="grid grid-cols-5 gap-4 items-center">
                  <div className="flex items-center space-x-2">
                    <Laptop className="h-4 w-4 text-muted-foreground" />
                    <span>
                      MacBook Pro
                      <div className="text-xs text-emerald-600">Current Session</div>
                    </span>
                  </div>
                  <div>San Francisco, CA</div>
                  <div>192.168.1.105</div>
                  <div>Just now</div>
                  <div></div>
                </div>
              </div>
              
              <div className="p-3">
                <div className="grid grid-cols-5 gap-4 items-center">
                  <div className="flex items-center space-x-2">
                    <Smartphone className="h-4 w-4 text-muted-foreground" />
                    <span>iPhone 13</span>
                  </div>
                  <div>San Francisco, CA</div>
                  <div>187.156.243.12</div>
                  <div>2 hours ago</div>
                  <div className="flex justify-end">
                    <Button size="sm" variant="outline">Revoke</Button>
                  </div>
                </div>
              </div>
              
              <div className="p-3">
                <div className="grid grid-cols-5 gap-4 items-center">
                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span>Chrome / Windows</span>
                  </div>
                  <div>Portland, OR</div>
                  <div>156.127.178.95</div>
                  <div>Yesterday</div>
                  <div className="flex justify-end">
                    <Button size="sm" variant="outline">Revoke</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Last security audit: May 1, 2025, 09:23 AM UTC
            </p>
            <Button variant="outline" onClick={() => {
              toast({
                title: "Sessions cleared",
                description: "All other sessions have been terminated. Only your current session remains active.",
              });
            }}>
              Revoke All Other Sessions
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SessionsSection;
