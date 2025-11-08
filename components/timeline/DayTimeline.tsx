'use client';

import { useState, useRef, useEffect } from 'react';
import { Task, UserProfile, getPriorityColor } from '@/types/shared';
import { TaskBlock } from './TaskBlock';
import { cn } from '@/lib/utils';
import { format, parse, isBefore, addMinutes } from 'date-fns';

interface DayTimelineProps {
  date: Date;
  tasks: Task[];
  userProfile: UserProfile | null;
  onTaskClick: (task: Task) => void;
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
  className?: string;
}

const HOURS = Array.from({ length: 24 }, (_, i) => {
  const hour = (i + 3) % 24;
  return hour;
});

export function DayTimeline({
  date,
  tasks,
  userProfile,
  onTaskClick,
  onTaskUpdate,
  className,
}: DayTimelineProps) {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [currentTimePosition, setCurrentTimePosition] = useState<number | null>(null);

  useEffect(() => {
    const updateCurrentTime = () => {
      const now = new Date();
      const currentDate = format(now, 'yyyy-MM-dd');
      const selectedDate = format(date, 'yyyy-MM-dd');

      if (currentDate === selectedDate) {
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const totalMinutes = hours * 60 + minutes;
        const startMinutes = 3 * 60;
        const adjustedMinutes = totalMinutes >= startMinutes ? totalMinutes - startMinutes : totalMinutes + (24 * 60 - startMinutes);
        const position = (adjustedMinutes / (24 * 60)) * 100;
        setCurrentTimePosition(position);
      } else {
        setCurrentTimePosition(null);
      }
    };

    updateCurrentTime();
    const interval = setInterval(updateCurrentTime, 60000);
    return () => clearInterval(interval);
  }, [date]);

  const getTaskPosition = (task: Task) => {
    const [hours, minutes] = task.time.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes;
    const startMinutes = 3 * 60;
    const adjustedMinutes = totalMinutes >= startMinutes ? totalMinutes - startMinutes : totalMinutes + (24 * 60 - startMinutes);
    const top = (adjustedMinutes / (24 * 60)) * 100;
    const height = (task.duration / (24 * 60)) * 100;
    return { top: `${top}%`, height: `${height}%` };
  };

  const isTaskEditable = (task: Task) => {
    const now = new Date();
    const taskDateTime = parse(`${format(date, 'yyyy-MM-dd')} ${task.time}`, 'yyyy-MM-dd HH:mm', new Date());
    const taskEndTime = addMinutes(taskDateTime, task.duration);
    return isBefore(now, taskEndTime);
  };

  const gradient = userProfile?.colorGradient || { low: '#60a5fa', high: '#c084fc' };

  return (
    <div className={cn('day-timeline relative h-full overflow-auto', className)} ref={timelineRef}>
      <div className="relative" style={{ height: '1440px', paddingBottom: '2rem' }}>
        {HOURS.map((hour, index) => (
          <div
            key={hour}
            className="absolute w-full flex items-center"
            style={{ top: `${(index / 24) * 100}%` }}
          >
            <span className="w-16 text-sm text-muted-foreground font-medium text-right mr-4" style={{ marginLeft: '-80px' }}>
              {format(new Date().setHours(hour, 0, 0, 0), 'h:mm a')}
            </span>
            <div className="flex-1 border-t border-border"></div>
          </div>
        ))}

        {currentTimePosition !== null && (
          <div
            className="absolute w-full border-t-2 border-red-500 z-10"
            style={{ top: `${currentTimePosition}%` }}
          >
            <div className="absolute -left-16 -top-3 text-sm font-semibold text-red-500">
              {format(new Date().setHours(new Date().getHours(), 0, 0, 0), 'h:mm a')}
            </div>
          </div>
        )}

        {tasks.map((task) => {
          const position = getTaskPosition(task);
          const isEditable = isTaskEditable(task);
          const color = getPriorityColor(task.priority, gradient);

          return (
            <TaskBlock
              key={task.id}
              task={task}
              position={position}
              color={color}
              isEditable={isEditable}
              onClick={() => onTaskClick(task)}
            />
          );
        })}
      </div>
    </div>
  );
}
