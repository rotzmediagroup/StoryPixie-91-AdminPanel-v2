import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Users, BookOpen, Clock, Activity } from "lucide-react";
import { DashboardStats } from '@/types';
import { Button } from '@/components/ui/button';
import StatCard from '@/components/dashboard/StatCard';
import MetricChart from '@/components/dashboard/MetricChart';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// Mock data for the demo
const analyticsData = {
  stats: {
    totalUsers: 12847,
    activeUsers: 3682,
    storiesGenerated: 48976,
    audioPlayed: 32584,
    averageSessionTime: 8.4, // in minutes
  },
  platforms: {
    web: { users: 4215, stories: 15432, audio: 10453 },
    ios: { users: 5612, stories: 21345, audio: 14672 },
    android: { users: 3020, stories: 12199, audio: 7459 },
  },
  timeRanges: {
    daily: [
      { date: '2025-04-25', users: 3102, stories: 1543, audio: 1123 },
      { date: '2025-04-26', users: 3245, stories: 1687, audio: 1254 },
      { date: '2025-04-27', users: 2987, stories: 1432, audio: 1087 },
      { date: '2025-04-28', users: 3421, stories: 1756, audio: 1321 },
      { date: '2025-04-29', users: 3567, stories: 1834, audio: 1453 },
      { date: '2025-04-30', users: 3412, stories: 1798, audio: 1345 },
      { date: '2025-05-01', users: 3682, stories: 1926, audio: 1501 },
    ],
    weekly: [
      { date: 'Week 13', users: 21450, stories: 10987, audio: 8321 },
      { date: 'Week 14', users: 22673, stories: 11543, audio: 8765 },
      { date: 'Week 15', users: 23127, stories: 12310, audio: 9087 },
      { date: 'Week 16', users: 24568, stories: 12876, audio: 9543 },
      { date: 'Week 17', users: 25432, stories: 13210, audio: 10123 },
    ],
    monthly: [
      { date: 'Dec 2024', users: 82345, stories: 42156, audio: 32154 },
      { date: 'Jan 2025', users: 87654, stories: 45321, audio: 34576 },
      { date: 'Feb 2025', users: 93241, stories: 48765, audio: 37432 },
      { date: 'Mar 2025', users: 98432, stories: 51432, audio: 39876 },
      { date: 'Apr 2025', users: 106543, stories: 54876, audio: 42345 },
    ],
  },
  topStories: [
    { id: 'ST123456', title: 'The Magic Forest Adventure', views: 2435, completions: 1987, avgRating: 4.8 },
    { id: 'ST234567', title: 'Princess of the Moon', views: 2187, completions: 1754, avgRating: 4.7 },
    { id: 'ST345678', title: 'Dinosaur Time Travel', views: 1976, completions: 1654, avgRating: 4.9 },
    { id: 'ST456789', title: 'The Talking Robot', views: 1876, completions: 1543, avgRating: 4.6 },
    { id: 'ST567890', title: 'Underwater Kingdom', views: 1765, completions: 1432, avgRating: 4.7 },
  ],
  retentionData: {
    day1: 87,
    day7: 64,
    day30: 42,
    day90: 28
  }
};

type TimeRangeType = 'daily' | 'weekly' | 'monthly';
type PlatformTab = 'all' | 'web' | 'ios' | 'android';

const AnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState<TimeRangeType>('daily');
  const [platformTab, setPlatformTab] = useState<PlatformTab>('all');
  
  const chartData = analyticsData.timeRanges[timeRange];
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Track performance metrics and user activity across platforms
        </p>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Users" 
          value={analyticsData.stats.totalUsers.toLocaleString()} 
          icon={Users} 
          trend={{ value: 8.2, isPositive: true }}
          description="vs. last month" 
        />
        <StatCard 
          title="Active Users" 
          value={analyticsData.stats.activeUsers.toLocaleString()} 
          icon={Activity} 
          trend={{ value: 12.5, isPositive: true }}
          description="vs. last month" 
        />
        <StatCard 
          title="Stories Generated" 
          value={analyticsData.stats.storiesGenerated.toLocaleString()} 
          icon={BookOpen} 
          trend={{ value: 15.3, isPositive: true }}
          description="vs. last month" 
        />
        <StatCard 
          title="Avg. Session Duration" 
          value={`${analyticsData.stats.averageSessionTime} min`} 
          icon={Clock} 
          trend={{ value: 3.8, isPositive: true }}
          description="vs. last month" 
        />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>User Activity</CardTitle>
              <CardDescription>Track users, stories, and audio plays over time</CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant={timeRange === 'daily' ? 'secondary' : 'outline'}
                size="sm"
                onClick={() => setTimeRange('daily')}
              >
                Daily
              </Button>
              <Button 
                variant={timeRange === 'weekly' ? 'secondary' : 'outline'}
                size="sm"
                onClick={() => setTimeRange('weekly')}
              >
                Weekly
              </Button>
              <Button 
                variant={timeRange === 'monthly' ? 'secondary' : 'outline'}
                size="sm"
                onClick={() => setTimeRange('monthly')}
              >
                Monthly
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <MetricChart
              data={chartData}
              categories={[
                { name: "users", color: "#9b87f5" },
                { name: "stories", color: "#6E59A5" },
                { name: "audio", color: "#D6BCFA" }
              ]}
              index="date"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Platform Breakdown</CardTitle>
            <CardDescription>User activity across different platforms</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" onValueChange={(value) => setPlatformTab(value as PlatformTab)}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="web">Web</TabsTrigger>
                <TabsTrigger value="ios">iOS</TabsTrigger>
                <TabsTrigger value="android">Android</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="pt-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Users</h4>
                    <div className="text-2xl font-bold">{analyticsData.stats.totalUsers.toLocaleString()}</div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Stories</h4>
                    <div className="text-2xl font-bold">{analyticsData.stats.storiesGenerated.toLocaleString()}</div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Audio</h4>
                    <div className="text-2xl font-bold">{analyticsData.stats.audioPlayed.toLocaleString()}</div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2">Web Usage</h4>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: `${(analyticsData.platforms.web.users / analyticsData.stats.totalUsers) * 100}%` }} />
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-muted-foreground">
                        {analyticsData.platforms.web.users.toLocaleString()} users
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {Math.round((analyticsData.platforms.web.users / analyticsData.stats.totalUsers) * 100)}%
                      </span>
                    </div>
                  </div>
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2">iOS Usage</h4>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-green-500" style={{ width: `${(analyticsData.platforms.ios.users / analyticsData.stats.totalUsers) * 100}%` }} />
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-muted-foreground">
                        {analyticsData.platforms.ios.users.toLocaleString()} users
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {Math.round((analyticsData.platforms.ios.users / analyticsData.stats.totalUsers) * 100)}%
                      </span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Android Usage</h4>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-orange-500" style={{ width: `${(analyticsData.platforms.android.users / analyticsData.stats.totalUsers) * 100}%` }} />
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-muted-foreground">
                        {analyticsData.platforms.android.users.toLocaleString()} users
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {Math.round((analyticsData.platforms.android.users / analyticsData.stats.totalUsers) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="web" className="pt-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Users</h4>
                    <div className="text-2xl font-bold">{analyticsData.platforms.web.users.toLocaleString()}</div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Stories</h4>
                    <div className="text-2xl font-bold">{analyticsData.platforms.web.stories.toLocaleString()}</div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Audio</h4>
                    <div className="text-2xl font-bold">{analyticsData.platforms.web.audio.toLocaleString()}</div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="ios" className="pt-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Users</h4>
                    <div className="text-2xl font-bold">{analyticsData.platforms.ios.users.toLocaleString()}</div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Stories</h4>
                    <div className="text-2xl font-bold">{analyticsData.platforms.ios.stories.toLocaleString()}</div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Audio</h4>
                    <div className="text-2xl font-bold">{analyticsData.platforms.ios.audio.toLocaleString()}</div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="android" className="pt-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Users</h4>
                    <div className="text-2xl font-bold">{analyticsData.platforms.android.users.toLocaleString()}</div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Stories</h4>
                    <div className="text-2xl font-bold">{analyticsData.platforms.android.stories.toLocaleString()}</div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Audio</h4>
                    <div className="text-2xl font-bold">{analyticsData.platforms.android.audio.toLocaleString()}</div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Retention</CardTitle>
            <CardDescription>Percentage of users who return after first use</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium">Day 1 Retention</div>
                  <div className="text-sm text-muted-foreground">{analyticsData.retentionData.day1}%</div>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500" 
                    style={{ width: `${analyticsData.retentionData.day1}%` }} 
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium">Day 7 Retention</div>
                  <div className="text-sm text-muted-foreground">{analyticsData.retentionData.day7}%</div>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500" 
                    style={{ width: `${analyticsData.retentionData.day7}%` }} 
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium">Day 30 Retention</div>
                  <div className="text-sm text-muted-foreground">{analyticsData.retentionData.day30}%</div>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-500" 
                    style={{ width: `${analyticsData.retentionData.day30}%` }} 
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium">Day 90 Retention</div>
                  <div className="text-sm text-muted-foreground">{analyticsData.retentionData.day90}%</div>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-purple-500" 
                    style={{ width: `${analyticsData.retentionData.day90}%` }} 
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Performing Stories</CardTitle>
          <CardDescription>Most viewed and highest rated stories</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Story ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="text-right">Views</TableHead>
                <TableHead className="text-right">Completions</TableHead>
                <TableHead className="text-right">Completion Rate</TableHead>
                <TableHead className="text-right">Avg. Rating</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {analyticsData.topStories.map((story) => (
                <TableRow key={story.id}>
                  <TableCell>{story.id}</TableCell>
                  <TableCell className="font-medium">{story.title}</TableCell>
                  <TableCell className="text-right">{story.views.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{story.completions.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    {Math.round((story.completions / story.views) * 100)}%
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end">
                      <span className="mr-2">{story.avgRating}</span>
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor(story.avgRating) ? 'text-yellow-400' : 'text-gray-300'}`}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsPage;
