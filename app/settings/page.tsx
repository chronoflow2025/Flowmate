'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings as SettingsIcon, Save, LayoutDashboard, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { UserSettings } from '@/types/shared';
import { useToast } from '@/hooks/use-toast';

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch('/api/settings');
        if (response.ok) {
          const data = await response.json();
          setSettings(data);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    
    setIsSaving(true);
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        toast({
          title: 'Settings saved',
          description: 'Your preferences have been updated successfully.',
        });
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to save settings. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const updateSettings = (section: keyof UserSettings, key: string, value: any) => {
    if (!settings) return;
    setSettings({
      ...settings,
      [section]: {
        ...settings[section],
        [key]: value,
      },
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading settings...</div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Failed to load settings</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background px-6 py-4" role="banner">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <SettingsIcon className="w-6 h-6 text-primary" aria-hidden="true" />
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
                <Button variant="ghost" size="sm" aria-label="View Analytics">
                  <BarChart3 className="w-4 h-4 mr-2" aria-hidden="true" />
                  Analytics
                </Button>
              </Link>
              <Link href="/settings">
                <Button variant="default" size="sm" aria-label="Open Settings" aria-current="page">
                  <SettingsIcon className="w-4 h-4 mr-2" aria-hidden="true" />
                  Settings
                </Button>
              </Link>
            </nav>
          </div>
          <Button onClick={handleSave} disabled={isSaving} aria-label={isSaving ? 'Saving settings...' : 'Save settings changes'}>
            <Save className="w-4 h-4 mr-2" aria-hidden="true" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6 space-y-6" role="main" aria-label="Settings">
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Manage how and when you receive notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive daily plan summaries via email</p>
              </div>
              <Switch
                id="email-notifications"
                checked={settings.notifications.email}
                onCheckedChange={(checked) => updateSettings('notifications', 'email', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="push-notifications">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive browser notifications for tasks</p>
              </div>
              <Switch
                id="push-notifications"
                checked={settings.notifications.push}
                onCheckedChange={(checked) => updateSettings('notifications', 'push', checked)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="feedback-timing">Feedback Timing (minutes before task end)</Label>
              <Select
                value={settings.notifications.feedbackTiming.toString()}
                onValueChange={(value) => updateSettings('notifications', 'feedbackTiming', parseInt(value))}
              >
                <SelectTrigger id="feedback-timing">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">At task end</SelectItem>
                  <SelectItem value="2">2 minutes before</SelectItem>
                  <SelectItem value="5">5 minutes before</SelectItem>
                  <SelectItem value="10">10 minutes before</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize the look and feel of FlowMate</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="dark-mode">Dark Mode</Label>
                <p className="text-sm text-muted-foreground">Enable dark theme</p>
              </div>
              <Switch
                id="dark-mode"
                checked={settings.appearance.darkMode}
                onCheckedChange={(checked) => updateSettings('appearance', 'darkMode', checked)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time-format">Time Format</Label>
              <Select
                value={settings.appearance.timeFormat}
                onValueChange={(value) => updateSettings('appearance', 'timeFormat', value)}
              >
                <SelectTrigger id="time-format">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12h">12-hour (e.g., 3:00 PM)</SelectItem>
                  <SelectItem value="24h">24-hour (e.g., 15:00)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="color-preset">Color Preset</Label>
              <Select
                value={settings.appearance.colorPreset}
                onValueChange={(value) => updateSettings('appearance', 'colorPreset', value)}
              >
                <SelectTrigger id="color-preset">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blue">Blue</SelectItem>
                  <SelectItem value="green">Green</SelectItem>
                  <SelectItem value="purple">Purple</SelectItem>
                  <SelectItem value="orange">Orange</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Privacy</CardTitle>
            <CardDescription>Control your data and privacy preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="data-collection">Anonymous Usage Data</Label>
                <p className="text-sm text-muted-foreground">Help improve FlowMate by sharing anonymous usage data</p>
              </div>
              <Switch
                id="data-collection"
                checked={settings.privacy.dataCollection}
                onCheckedChange={(checked) => updateSettings('privacy', 'dataCollection', checked)}
              />
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
