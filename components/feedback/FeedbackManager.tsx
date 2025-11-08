'use client';

import { useState, useEffect, useCallback } from 'react';
import { FeedbackToast } from './FeedbackToast';
import { Task, Feedback } from '@/types/shared';
import { useToast } from '@/hooks/use-toast';

interface FeedbackManagerProps {
  tasks: Task[];
  currentDate: string;
  userId: string;
}

export function FeedbackManager({ tasks, currentDate, userId }: FeedbackManagerProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const { toast } = useToast();

  const checkForUpcomingTaskEnds = useCallback(() => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;

    for (const task of tasks) {
      if (task.completed) continue;

      const [taskHour, taskMinute] = task.time.split(':').map(Number);
      const taskStartInMinutes = taskHour * 60 + taskMinute;
      const taskEndInMinutes = taskStartInMinutes + task.duration;
      
      const minutesUntilEnd = taskEndInMinutes - currentTimeInMinutes;

      if (minutesUntilEnd === 2) {
        setActiveTask(task);
        return;
      }
    }
  }, [tasks]);

  useEffect(() => {
    const interval = setInterval(checkForUpcomingTaskEnds, 60000);
    
    checkForUpcomingTaskEnds();

    return () => clearInterval(interval);
  }, [checkForUpcomingTaskEnds]);

  const handleSubmitFeedback = async (feedbackData: Omit<Feedback, 'timestamp' | 'taskDate'>) => {
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...feedbackData,
          taskDate: currentDate,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }

      toast({
        title: 'Feedback submitted',
        description: 'Thank you for your feedback! This helps improve your future plans.',
      });

      setActiveTask(null);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit feedback. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDismiss = () => {
    setActiveTask(null);
  };

  if (!activeTask) {
    return null;
  }

  return (
    <FeedbackToast
      task={activeTask}
      onSubmit={handleSubmitFeedback}
      onDismiss={handleDismiss}
    />
  );
}
