'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface StepPeakHoursProps {
  selected: string[];
  onChange: (hours: string[]) => void;
}

const TIME_PERIODS = [
  { id: 'early-morning', label: 'Early Morning', time: '5-8 AM', icon: '🌅' },
  { id: 'morning', label: 'Morning', time: '8-11 AM', icon: '☀️' },
  { id: 'midday', label: 'Midday', time: '11 AM-2 PM', icon: '🌤️' },
  { id: 'afternoon', label: 'Afternoon', time: '2-5 PM', icon: '🌆' },
  { id: 'evening', label: 'Evening', time: '5-8 PM', icon: '🌇' },
  { id: 'night', label: 'Night', time: '8-11 PM', icon: '🌙' },
  { id: 'late-night', label: 'Late Night', time: '11 PM-2 AM', icon: '🌃' },
];

export function StepPeakHours({ selected, onChange }: StepPeakHoursProps) {
  const togglePeriod = (periodId: string) => {
    if (selected.includes(periodId)) {
      onChange(selected.filter((h) => h !== periodId));
    } else {
      onChange([...selected, periodId]);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Peak Productivity Hours</CardTitle>
        <CardDescription>
          When are you most productive and energized?
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3">
          {TIME_PERIODS.map((period) => (
            <Button
              key={period.id}
              variant="outline"
              onClick={() => togglePeriod(period.id)}
              className={cn(
                'h-16 flex items-center justify-between px-6',
                selected.includes(period.id) && 'border-primary bg-primary/10'
              )}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{period.icon}</span>
                <div className="text-left">
                  <div className="font-medium">{period.label}</div>
                  <div className="text-xs text-muted-foreground">{period.time}</div>
                </div>
              </div>
            </Button>
          ))}
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          Selected: {selected.length} {selected.length === 1 ? 'period' : 'periods'}
        </p>
      </CardContent>
    </Card>
  );
}
