'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

interface StepFocusProps {
  value?: number;
  onChange: (value: number) => void;
}

const FOCUS_LABELS: Record<number, string> = {
  1: 'Easily distracted',
  2: 'Often distracted',
  3: 'Sometimes distracted',
  4: 'Usually focused',
  5: 'Moderately focused',
  6: 'Pretty focused',
  7: 'Very focused',
  8: 'Highly focused',
  9: 'Extremely focused',
  10: 'Laser-focused',
};

export function StepFocus({ value = 5, onChange }: StepFocusProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Focus Level</CardTitle>
        <CardDescription>
          How would you rate your typical focus when working on tasks?
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <Label>Focus Scale (1-10)</Label>
            <div className="mt-4">
              <Slider
                value={[value]}
                onValueChange={(values: number[]) => onChange(values[0])}
                min={1}
                max={10}
                step={1}
                className="mb-4"
              />
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">{value}/10</div>
            <p className="text-sm text-muted-foreground">
              {FOCUS_LABELS[value] || 'Focused'}
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            This helps us understand how long you can typically maintain concentration
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
