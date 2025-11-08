'use client';

import { Task } from '@/types/shared';
import { cn } from '@/lib/utils';
import { CheckCircle2, Circle } from 'lucide-react';

interface TaskBlockProps {
  task: Task;
  position: { top: string; height: string };
  color: string;
  isEditable: boolean;
  onClick: () => void;
}

export function TaskBlock({
  task,
  position,
  color,
  isEditable,
  onClick,
}: TaskBlockProps) {
  return (
    <div
      className={cn(
        'absolute left-0 right-0 mx-2 rounded-md p-2 cursor-pointer transition-all hover:shadow-md border',
        !isEditable && 'opacity-50 cursor-not-allowed'
      )}
      style={{
        top: position.top,
        height: position.height,
        backgroundColor: color + '30',
        borderColor: color,
        borderLeftWidth: '4px',
      }}
      onClick={isEditable ? onClick : undefined}
    >
      <div className="flex items-start gap-2 h-full">
        <div className="flex-shrink-0 mt-0.5">
          {task.completed ? (
            <CheckCircle2 className="w-4 h-4 text-green-600" />
          ) : (
            <Circle className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className={cn(
            'text-sm font-medium truncate',
            task.completed && 'line-through text-muted-foreground'
          )}>
            {task.title}
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">
            {task.time} • {task.duration}min • Priority: {task.priority.toFixed(1)}
          </div>
        </div>
      </div>
      {!isEditable && (
        <div className="absolute inset-0 bg-gray-500/10 rounded-md flex items-center justify-center">
          <span className="text-xs font-medium text-muted-foreground">Past Event</span>
        </div>
      )}
    </div>
  );
}
