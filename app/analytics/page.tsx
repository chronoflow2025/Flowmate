'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { BarChart3, TrendingUp, Activity, Target, LayoutDashboard, Settings } from 'lucide-react';
import Link from 'next/link';

export default function AnalyticsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [insights, setInsights] = useState<any>(null);

  useEffect(() => {
    const loadInsights = async () => {
      try {
        const response = await fetch('/api/analytics/insights');
        if (response.ok) {
          const data = await response.json();
          setInsights(data.insights);
        }
      } catch (error) {
        console.error('Error loading insights:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInsights();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-6 h-6 text-primary" />
              <h1 className="text-2xl font-bold">FlowMate</h1>
            </div>
            <nav className="flex items-center gap-2">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/analytics">
                <Button variant="default" size="sm">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Analytics
                </Button>
              </Link>
              <Link href="/settings">
                <Button variant="ghost" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">Loading analytics...</div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Overall Focus</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {insights?.overallFocus ? `${insights.overallFocus}/10` : 'N/A'}
                  </div>
                  <p className="text-xs text-muted-foreground">Average focus rating</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {insights?.overallCompletion ? `${insights.overallCompletion}%` : 'N/A'}
                  </div>
                  <p className="text-xs text-muted-foreground">Average completion</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Feedback</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {insights?.totalFeedback || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">Tasks completed</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Best Hours</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-sm font-bold">
                    {insights?.bestHours?.join(', ') || 'Not enough data'}
                  </div>
                  <p className="text-xs text-muted-foreground">Peak productivity</p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="trends" className="space-y-4">
              <TabsList>
                <TabsTrigger value="trends">Productivity Trends</TabsTrigger>
                <TabsTrigger value="activity">Activity Patterns</TabsTrigger>
                <TabsTrigger value="focus">Focus Analysis</TabsTrigger>
              </TabsList>

              <TabsContent value="trends" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>30-Day Productivity Trend</CardTitle>
                    <CardDescription>Your productivity score over the last month</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80 flex items-center justify-center text-muted-foreground">
                    Chart will be implemented here
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Completion Rate Trends</CardTitle>
                    <CardDescription>Weekly task completion rates</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80 flex items-center justify-center text-muted-foreground">
                    Chart will be implemented here
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activity" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Time-of-Day Activity</CardTitle>
                    <CardDescription>Your activity patterns throughout the day</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80 flex items-center justify-center text-muted-foreground">
                    Chart will be implemented here
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Weekly Heatmap</CardTitle>
                    <CardDescription>Activity intensity by day and hour</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80 flex items-center justify-center text-muted-foreground">
                    Chart will be implemented here
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="focus" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Focus vs Completion</CardTitle>
                    <CardDescription>Relationship between focus and task completion</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80 flex items-center justify-center text-muted-foreground">
                    Chart will be implemented here
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Focus-Completion Matrix</CardTitle>
                    <CardDescription>Task distribution by focus and completion quadrants</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80 flex items-center justify-center text-muted-foreground">
                    Chart will be implemented here
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </main>
    </div>
  );
}
