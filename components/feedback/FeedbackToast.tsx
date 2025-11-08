'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { X, Send } from 'lucide-react';
import { Task, Feedback } from '@/types/shared';
import { cn } from '@/lib/utils';

interface FeedbackToastProps {
  task: Task;
  onSubmit: (feedback: Omit<Feedback, 'timestamp' | 'taskDate'>) => void;
  onDismiss: () => void;
}

export function FeedbackToast({ task, onSubmit, onDismiss }: FeedbackToastProps) {
  const [focusRating, setFocusRating] = useState<number>(5);
  const [completionPercent, setCompletionPercent] = useState<number>(100);
  const [textFeedback, setTextFeedback] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const handleSubmit = () => {
    onSubmit({
      taskId: task.id,
      focusRating,
      completionPercent,
      textFeedback: textFeedback.trim() || undefined,
    });
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(onDismiss, 300);
  };

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 w-96 bg-background border rounded-lg shadow-2xl p-6 transition-all duration-300 z-50",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-lg">How did it go?</h3>
          <p className="text-sm text-muted-foreground mt-1">{task.title}</p>
          <p className="text-xs text-muted-foreground">
            {task.time} • {task.duration} minutes
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={handleDismiss}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">Focus Level</label>
            <span className="text-sm font-semibold text-primary">{focusRating}/10</span>
          </div>
          <Slider
            value={[focusRating]}
            onValueChange={(value) => setFocusRating(value[0])}
            min={1}
            max={10}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Low</span>
            <span>High</span>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Completion Rate</label>
          <Select
            value={completionPercent.toString()}
            onValueChange={(value: string) => setCompletionPercent(parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">0% - Didn't start</SelectItem>
              <SelectItem value="25">25% - Started</SelectItem>
              <SelectItem value="50">50% - Half done</SelectItem>
              <SelectItem value="75">75% - Almost done</SelectItem>
              <SelectItem value="100">100% - Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">
            Additional Notes <span className="text-muted-foreground">(optional)</span>
          </label>
          <Textarea
            value={textFeedback}
            onChange={(e) => setTextFeedback(e.target.value)}
            placeholder="Any blockers, insights, or notes..."
            className="min-h-[80px] resize-none"
          />
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleDismiss}
          >
            Skip
          </Button>
          <Button
            className="flex-1"
            onClick={handleSubmit}
          >
            <Send className="w-4 h-4 mr-2" />
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}
