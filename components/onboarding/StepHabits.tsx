'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface StepHabitsProps {
  selected: string[];
  onChange: (habits: string[]) => void;
}

const HABIT_OPTIONS = [
  { id: 'exercise', label: 'Morning Exercise', icon: '💪' },
  { id: 'meditation', label: 'Meditation', icon: '🧘' },
  { id: 'reading', label: 'Reading', icon: '📚' },
  { id: 'journaling', label: 'Journaling', icon: '✍️' },
  { id: 'breakfast', label: 'Healthy Breakfast', icon: '🥗' },
  { id: 'learning', label: 'Learning/Courses', icon: '🎓' },
  { id: 'social', label: 'Social Time', icon: '👥' },
  { id: 'creative', label: 'Creative Work', icon: '🎨' },
];

export function StepHabits({ selected, onChange }: StepHabitsProps) {
  const toggleHabit = (habitId: string) => {
    if (selected.includes(habitId)) {
      onChange(selected.filter((h) => h !== habitId));
    } else {
      onChange([...selected, habitId]);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Your Habits</CardTitle>
        <CardDescription>
          Choose activities you'd like to incorporate into your daily routine
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {HABIT_OPTIONS.map((habit) => (
            <Button
              key={habit.id}
              variant="outline"
              onClick={() => toggleHabit(habit.id)}
              className={cn(
                'h-20 flex flex-col items-center justify-center gap-2',
                selected.includes(habit.id) && 'border-primary bg-primary/10'
              )}
            >
              <span className="text-2xl">{habit.icon}</span>
              <span className="text-sm">{habit.label}</span>
            </Button>
          ))}
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          Selected: {selected.length} {selected.length === 1 ? 'habit' : 'habits'}
        </p>
      </CardContent>
    </Card>
  );
}
