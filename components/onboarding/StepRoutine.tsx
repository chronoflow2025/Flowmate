'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface StepRoutineProps {
  wakeTime: string;
  sleepTime: string;
  onChange: (wakeTime: string, sleepTime: string) => void;
}

export function StepRoutine({ wakeTime, sleepTime, onChange }: StepRoutineProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Routine</CardTitle>
        <CardDescription>
          When do you typically start and end your day?
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <Label htmlFor="wake-time">Wake Up Time</Label>
            <Input
              id="wake-time"
              type="time"
              value={wakeTime}
              onChange={(e) => onChange(e.target.value, sleepTime)}
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="sleep-time">Sleep Time</Label>
            <Input
              id="sleep-time"
              type="time"
              value={sleepTime}
              onChange={(e) => onChange(wakeTime, e.target.value)}
              className="mt-2"
            />
          </div>
          <p className="text-sm text-muted-foreground">
            We'll schedule tasks within your active hours
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
