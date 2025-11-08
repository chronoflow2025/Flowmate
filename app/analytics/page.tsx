'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { BarChart3, TrendingUp, Activity, Target, LayoutDashboard, Settings } from 'lucide-react';
import Link from 'next/link';
import {
  ProductivityTrendChart,
  WeeklyHeatmapChart,
  TimeOfDayActivityChart,
  FocusVsCompletionChart,
  CompletionTrendsChart,
  FocusCompletionMatrixChart,
} from '@/components/charts';

export default function AnalyticsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [insights, setInsights] = useState<any>(null);
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [insightsResponse, chartsResponse] = await Promise.all([
          fetch('/api/analytics/insights'),
          fetch('/api/analytics/charts'),
        ]);

        if (insightsResponse.ok) {
          const data = await insightsResponse.json();
          setInsights(data.insights);
        }

        if (chartsResponse.ok) {
          const data = await chartsResponse.json();
          setChartData(data);
        }
      } catch (error) {
        console.error('Error loading analytics data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background px-6 py-4" role="banner">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-6 h-6 text-primary" aria-hidden="true" />
              <h1 className="text-2xl font-bold">FlowMate</h1>
            </div>
            <nav className="flex items-center gap-2" aria-label="Main navigation">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" aria-label="Go to Dashboard">
                  <LayoutDashboard className="w-4 h-4 mr-2" aria-hidden="true" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/analytics">
                <Button variant="default" size="sm" aria-label="View Analytics" aria-current="page">
                  <BarChart3 className="w-4 h-4 mr-2" aria-hidden="true" />
                  Analytics
                </Button>
              </Link>
              <Link href="/settings">
                <Button variant="ghost" size="sm" aria-label="Open Settings">
                  <Settings className="w-4 h-4 mr-2" aria-hidden="true" />
                  Settings
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6" role="main" aria-label="Analytics Dashboard">
        {isLoading ? (
          <div className="flex items-center justify-center h-64" role="status" aria-live="polite">
            <div className="text-muted-foreground">Loading analytics...</div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4" role="region" aria-label="Performance Summary">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Overall Focus</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" aria-label={`Average focus rating: ${insights?.overallFocus ? `${insights.overallFocus} out of 10` : 'Not available'}`}>
                    {insights?.overallFocus ? `${insights.overallFocus}/10` : 'N/A'}
                  </div>
                  <p className="text-xs text-muted-foreground" aria-hidden="true">Average focus rating</p>
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

            <Tabs defaultValue="trends" className="space-y-4" aria-label="Analytics Chart Tabs">
              <TabsList role="tablist">
                <TabsTrigger value="trends" role="tab" aria-controls="trends-panel">Productivity Trends</TabsTrigger>
                <TabsTrigger value="activity" role="tab" aria-controls="activity-panel">Activity Patterns</TabsTrigger>
                <TabsTrigger value="focus" role="tab" aria-controls="focus-panel">Focus Analysis</TabsTrigger>
              </TabsList>

              <TabsContent value="trends" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>30-Day Productivity Trend</CardTitle>
                    <CardDescription>Your productivity score over the last month</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {chartData ? (
                      <ProductivityTrendChart data={chartData.productivityTrend} />
                    ) : (
                      <div className="h-80 flex items-center justify-center text-muted-foreground">
                        Loading chart...
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Completion Rate Trends</CardTitle>
                    <CardDescription>Weekly task completion rates</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {chartData ? (
                      <CompletionTrendsChart data={chartData.completionTrends} />
                    ) : (
                      <div className="h-80 flex items-center justify-center text-muted-foreground">
                        Loading chart...
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activity" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Time-of-Day Activity</CardTitle>
                    <CardDescription>Your activity patterns throughout the day</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {chartData ? (
                      <TimeOfDayActivityChart data={chartData.hourlyActivity} />
                    ) : (
                      <div className="h-80 flex items-center justify-center text-muted-foreground">
                        Loading chart...
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Weekly Heatmap</CardTitle>
                    <CardDescription>Activity intensity by day and hour</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {chartData ? (
                      <WeeklyHeatmapChart data={chartData.weeklyHeatmap} />
                    ) : (
                      <div className="h-80 flex items-center justify-center text-muted-foreground">
                        Loading chart...
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="focus" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Focus vs Completion</CardTitle>
                    <CardDescription>Relationship between focus and task completion</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {chartData ? (
                      <FocusVsCompletionChart data={chartData.focusVsCompletion} />
                    ) : (
                      <div className="h-80 flex items-center justify-center text-muted-foreground">
                        Loading chart...
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Focus-Completion Matrix</CardTitle>
                    <CardDescription>Task distribution by focus and completion quadrants</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {chartData ? (
                      <FocusCompletionMatrixChart data={chartData.focusCompletionMatrix} />
                    ) : (
                      <div className="h-80 flex items-center justify-center text-muted-foreground">
                        Loading chart...
                      </div>
                    )}
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
