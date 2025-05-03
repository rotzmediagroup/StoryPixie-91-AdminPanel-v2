
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LinkIcon } from 'lucide-react';

const ConnectedAppsSection = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <LinkIcon className="h-5 w-5" />
          <CardTitle>Connected Applications</CardTitle>
        </div>
        <CardDescription>
          Manage third-party services connected to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="border rounded-md overflow-hidden">
            <div className="divide-y">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 rounded bg-slate-100 flex items-center justify-center">
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www3.org/2000/svg">
                      <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 16.5V7.5L16 12L10 16.5Z" fill="currentColor" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium">YouTube</h4>
                    <p className="text-sm text-muted-foreground">Access to upload videos</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Remove</Button>
              </div>
              
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 rounded bg-slate-100 flex items-center justify-center">
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www3.org/2000/svg">
                      <path d="M22 12C22 6.48 17.52 2 12 2C6.48 2 2 6.44 6.44 20.87 10 21.8V15H8V12H10V9.5C10 7.57 11.57 6 13.5 6H16V9H14C13.45 9 13 9.45 13 10V12H16V15H13V21.95C18.05 21.45 22 17.19 22 12Z" fill="currentColor" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium">Facebook</h4>
                    <p className="text-sm text-muted-foreground">Access to your profile information</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Remove</Button>
              </div>
              
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 rounded bg-slate-100 flex items-center justify-center">
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www3.org/2000/svg">
                      <path d="M22.46 6C21.69 6.35 20.86 6.58 20 6.69C20.88 6.16 21.56 5.32 21.88 4.31C21.05 4.81 20.13 5.16 19.16 5.36C18.37 4.5 17.26 4 16 4C13.65 4 11.73 5.92 11.73 8.29C11.73 8.63 11.77 8.96 11.84 9.27C8.28 9.09 5.11 7.38 3 4.79C2.63 5.42 2.42 6.16 2.42 6.94C2.42 8.43 3.17 9.75 4.33 10.5C3.62 10.5 2.96 10.3 2.38 10V10.03C2.38 12.11 3.86 13.85 5.82 14.24C5.19 14.41 4.53 14.42 3.9 14.26C4.47 15.97 6.07 17.15 7.92 17.18C6.44 18.25 4.59 18.86 2.64 18.86C2.29 18.86 1.95 18.84 1.61 18.79C3.47 19.94 5.7 20.58 8.07 20.58C16 20.58 20.33 14.03 20.33 8.31C20.33 8.13 20.33 7.95 20.32 7.76C21.16 7.19 21.89 6.46 22.46 5.64V6Z" fill="currentColor" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium">Twitter</h4>
                    <p className="text-sm text-muted-foreground">Read and post tweets</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Remove</Button>
              </div>
            </div>
          </div>
          
          <Button variant="outline" className="w-full">
            Connect New Application
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConnectedAppsSection;
