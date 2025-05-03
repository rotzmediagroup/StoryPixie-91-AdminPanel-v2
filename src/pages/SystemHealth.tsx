import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { SystemHealth as SystemHealthType } from '@/types';
import { Activity, AlertCircle, CheckCircle, RefreshCw, Server, Clock, Cpu, Database, HardDrive, Network, Cloud, MemoryStick } from 'lucide-react';

// Mock system health data
const mockSystemServices: SystemHealthType[] = [
  {
    service: "API Gateway",
    status: "operational",
    lastChecked: "2024-05-01T10:30:22Z",
    responseTime: 38
  },
  {
    service: "Authentication Service",
    status: "operational",
    lastChecked: "2024-05-01T10:30:18Z",
    responseTime: 52
  },
  {
    service: "Story Generation Engine",
    status: "operational",
    lastChecked: "2024-05-01T10:30:15Z",
    responseTime: 245
  },
  {
    service: "Image Generation Service",
    status: "degraded",
    lastChecked: "2024-05-01T10:29:50Z",
    responseTime: 1250,
    error: "High latency detected"
  },
  {
    service: "Audio Processing",
    status: "operational",
    lastChecked: "2024-05-01T10:30:05Z",
    responseTime: 128
  },
  {
    service: "Database Cluster",
    status: "operational",
    lastChecked: "2024-05-01T10:30:12Z",
    responseTime: 18
  },
  {
    service: "CDN",
    status: "operational",
    lastChecked: "2024-05-01T10:30:20Z",
    responseTime: 15
  },
  {
    service: "User Content Storage",
    status: "operational",
    lastChecked: "2024-05-01T10:30:09Z",
    responseTime: 87
  },
  {
    service: "Email Delivery",
    status: "down",
    lastChecked: "2024-05-01T10:28:45Z",
    error: "Connection timeout to SMTP server"
  }
];

// Mock system resources data
const mockSystemResources = {
  cpu: {
    usage: 32,
    temperature: 45,
    cores: 16
  },
  memory: {
    total: 64,
    used: 28.5,
    free: 35.5
  },
  disk: {
    total: 2048,
    used: 876,
    free: 1172
  },
  network: {
    incoming: 35.8,
    outgoing: 22.4,
    connections: 1248
  }
};

// Mock recent incidents
const mockIncidents = [
  {
    id: "inc-001",
    title: "Email Service Outage",
    service: "Email Delivery",
    severity: "critical",
    startTime: "2024-05-01T10:28:45Z",
    status: "investigating",
    description: "Email delivery service is currently down. Our team is investigating the issue.",
    updates: [
      {
        time: "2024-05-01T10:28:45Z",
        message: "Issue detected with email delivery service."
      },
      {
        time: "2024-05-01T10:30:10Z",
        message: "Engineering team has been notified and is investigating the cause."
      }
    ]
  },
  {
    id: "inc-002",
    title: "Image Generation Latency",
    service: "Image Generation Service",
    severity: "moderate",
    startTime: "2024-05-01T09:45:22Z",
    status: "identified",
    description: "Users are experiencing delays when generating images. We've identified the cause and are working on a fix.",
    updates: [
      {
        time: "2024-05-01T09:45:22Z",
        message: "Increased latency detected in image generation service."
      },
      {
        time: "2024-05-01T10:05:15Z",
        message: "Issue identified as high CPU usage on rendering cluster."
      },
      {
        time: "2024-05-01T10:20:30Z",
        message: "Added additional capacity to the rendering cluster. Monitoring the situation."
      }
    ]
  },
  {
    id: "inc-003",
    title: "Database Connectivity Issues",
    service: "Database Cluster",
    severity: "minor",
    startTime: "2024-04-30T22:15:10Z",
    endTime: "2024-04-30T22:45:12Z",
    status: "resolved",
    description: "Brief connectivity issues to the database cluster caused by network maintenance.",
    updates: [
      {
        time: "2024-04-30T22:15:10Z",
        message: "Intermittent database connectivity issues detected."
      },
      {
        time: "2024-04-30T22:25:45Z",
        message: "Identified as related to scheduled network maintenance."
      },
      {
        time: "2024-04-30T22:45:12Z",
        message: "Network maintenance completed, services fully restored."
      }
    ]
  }
];

const SystemHealth = () => {
  const { toast } = useToast();
  const [services, setServices] = useState<SystemHealthType[]>(mockSystemServices);
  const [resources, setResources] = useState(mockSystemResources);
  const [incidents, setIncidents] = useState(mockIncidents);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate API call delay
    setTimeout(() => {
      toast({
        title: "System status refreshed",
        description: "All system services and metrics have been updated."
      });
      setIsRefreshing(false);
    }, 1500);
  };

  const formatDateTime = (dateTimeString: string): string => {
    const date = new Date(dateTimeString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case "operational":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "degraded":
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      case "down":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Activity className="h-5 w-5" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "operational":
        return <Badge className="bg-green-500 hover:bg-green-600">Operational</Badge>;
      case "degraded":
        return <Badge className="bg-amber-500 hover:bg-amber-600">Degraded</Badge>;
      case "down":
        return <Badge className="bg-red-500 hover:bg-red-600">Down</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getIncidentSeverityBadge = (severity: string) => {
    switch(severity) {
      case "critical":
        return <Badge className="bg-red-500 hover:bg-red-600">Critical</Badge>;
      case "major":
        return <Badge className="bg-orange-500 hover:bg-orange-600">Major</Badge>;
      case "moderate":
        return <Badge className="bg-amber-500 hover:bg-amber-600">Moderate</Badge>;
      case "minor":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Minor</Badge>;
      default:
        return <Badge>{severity}</Badge>;
    }
  };

  const getIncidentStatusBadge = (status: string) => {
    switch(status) {
      case "investigating":
        return <Badge variant="outline" className="border-blue-500 text-blue-500">Investigating</Badge>;
      case "identified":
        return <Badge variant="outline" className="border-amber-500 text-amber-500">Identified</Badge>;
      case "monitoring":
        return <Badge variant="outline" className="border-purple-500 text-purple-500">Monitoring</Badge>;
      case "resolved":
        return <Badge variant="outline" className="border-green-500 text-green-500">Resolved</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Calculate overall system health
  const calculateSystemHealth = () => {
    const operational = services.filter(s => s.status === "operational").length;
    const total = services.length;
    return {
      percent: Math.round((operational / total) * 100),
      status: operational === total ? "Fully Operational" : 
              operational >= total * 0.9 ? "Mostly Operational" : 
              operational >= total * 0.7 ? "Partially Degraded" : 
              "Major Outage"
    };
  };

  const systemHealth = calculateSystemHealth();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Health</h1>
          <p className="text-muted-foreground">
            Monitor the status of all system services and resources
          </p>
        </div>
        <Button onClick={handleRefresh} disabled={isRefreshing}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          {isRefreshing ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      {/* System Health Summary Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>System Status: {systemHealth.status}</CardTitle>
          <CardDescription>
            Last checked: {formatDateTime(services[0].lastChecked)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Overall Health</span>
              <span className="font-semibold">{systemHealth.percent}%</span>
            </div>
            <Progress value={systemHealth.percent} className="h-2" />
          </div>

          {/* Active Incidents Alert */}
          {incidents.filter(i => i.status !== "resolved").length > 0 && (
            <Alert className="mt-4 border-amber-500">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              <AlertTitle>Active Incidents</AlertTitle>
              <AlertDescription>
                There are {incidents.filter(i => i.status !== "resolved").length} active incidents that require attention.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="services" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="incidents">Incidents</TabsTrigger>
        </TabsList>

        <TabsContent value="services" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((service) => (
              <Card key={service.service} className="overflow-hidden">
                <div className={`h-1 w-full ${
                  service.status === "operational" ? "bg-green-500" :
                  service.status === "degraded" ? "bg-amber-500" : "bg-red-500"
                }`}></div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {getStatusIcon(service.status)}
                      {service.service}
                    </CardTitle>
                    {getStatusBadge(service.status)}
                  </div>
                  <CardDescription className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                    Last checked: {formatDateTime(service.lastChecked)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {service.responseTime ? (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Response Time</span>
                        <span className={`font-medium ${
                          service.responseTime < 100 ? "text-green-500" :
                          service.responseTime < 500 ? "text-amber-500" : "text-red-500"
                        }`}>
                          {service.responseTime}ms
                        </span>
                      </div>
                      <Progress 
                        value={Math.min(100, service.responseTime / 10)} 
                        className={`h-1 ${
                          service.responseTime < 100 ? "bg-green-500" :
                          service.responseTime < 500 ? "bg-amber-500" : "bg-red-500"
                        }`}
                      />
                    </div>
                  ) : null}
                  
                  {service.error && (
                    <div className="mt-2 text-sm text-red-500 flex items-start gap-1">
                      <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>{service.error}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="resources" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* CPU Usage */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-blue-500" />
                  <CardTitle>CPU Usage</CardTitle>
                </div>
                <CardDescription>
                  {resources.cpu.cores} cores • {resources.cpu.temperature}°C
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Usage</span>
                    <span className="font-semibold">{resources.cpu.usage}%</span>
                  </div>
                  <Progress value={resources.cpu.usage} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Memory Usage */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <MemoryStick className="h-5 w-5 text-purple-500" />
                  <CardTitle>Memory Usage</CardTitle>
                </div>
                <CardDescription>
                  {resources.memory.total} GB Total
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Used: {resources.memory.used} GB</span>
                    <span className="font-semibold">{Math.round((resources.memory.used / resources.memory.total) * 100)}%</span>
                  </div>
                  <Progress value={(resources.memory.used / resources.memory.total) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Disk Usage */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <HardDrive className="h-5 w-5 text-amber-500" />
                  <CardTitle>Disk Usage</CardTitle>
                </div>
                <CardDescription>
                  {resources.disk.total} GB Total
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Used: {resources.disk.used} GB</span>
                    <span className="font-semibold">{Math.round((resources.disk.used / resources.disk.total) * 100)}%</span>
                  </div>
                  <Progress value={(resources.disk.used / resources.disk.total) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Network */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Network className="h-5 w-5 text-green-500" />
                  <CardTitle>Network</CardTitle>
                </div>
                <CardDescription>
                  {resources.network.connections} Active connections
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Incoming</div>
                    <div className="font-semibold">{resources.network.incoming} MB/s</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Outgoing</div>
                    <div className="font-semibold">{resources.network.outgoing} MB/s</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="incidents" className="mt-4">
          <div className="space-y-4">
            {incidents.map((incident) => (
              <Card key={incident.id} className={incident.status === "resolved" ? "opacity-70" : ""}>
                <CardHeader className="pb-3">
                  <div className="flex flex-col sm:flex-row justify-between gap-2">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {incident.status === "resolved" ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-red-500" />
                        )}
                        {incident.title}
                      </CardTitle>
                      <CardDescription>{incident.service}</CardDescription>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {getIncidentSeverityBadge(incident.severity)}
                      {getIncidentStatusBadge(incident.status)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-3">
                  <p className="text-sm mb-4">{incident.description}</p>
                  
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold">Timeline</h4>
                    <div className="space-y-3 relative border-l border-muted pl-4 ml-1">
                      {incident.updates.map((update, index) => (
                        <div key={index} className="relative">
                          <div className="absolute -left-[21px] w-4 h-4 rounded-full bg-muted-foreground" />
                          <p className="text-xs text-muted-foreground">{formatDateTime(update.time)}</p>
                          <p className="text-sm">{update.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <div className="text-sm text-muted-foreground w-full flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div>Started: {formatDateTime(incident.startTime)}</div>
                    {incident.endTime && <div>Resolved: {formatDateTime(incident.endTime)}</div>}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemHealth;
