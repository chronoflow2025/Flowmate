'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface StepOccupationProps {
  value: string;
  onChange: (value: string) => void;
}

export function StepOccupation({ value, onChange }: StepOccupationProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>What's your occupation?</CardTitle>
        <CardDescription>
          Tell us what you do so we can tailor your daily plan
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="occupation">Occupation / Industry</Label>
            <Input
              id="occupation"
              placeholder="e.g., Software Engineer, Student, Entrepreneur"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="mt-2"
            />
          </div>
          <p className="text-sm text-muted-foreground">
            This helps us understand your work style and generate relevant tasks
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
