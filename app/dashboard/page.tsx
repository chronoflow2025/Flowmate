'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ProductivityCalendar } from '@/components/calendar/ProductivityCalendar';
import { DayTimeline } from '@/components/timeline/DayTimeline';
import { TaskEditDialog } from '@/components/timeline/TaskEditDialog';
import { usePlanStore } from '@/stores/plan';
import { useUserStore } from '@/stores/user';
import { Task } from '@/types/shared';
import { Button } from '@/components/ui/button';
import { Calendar, LayoutDashboard } from 'lucide-react';

export default function DashboardPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);

  const currentPlan = usePlanStore((state) => state.currentPlan);
  const setCurrentPlan = usePlanStore((state) => state.setCurrentPlan);
  const setSelectedDateInStore = usePlanStore((state) => state.setSelectedDate);
  const updateTask = usePlanStore((state) => state.updateTask);
  const removeTask = usePlanStore((state) => state.removeTask);
  const userProfile = useUserStore((state) => state.profile);

  useEffect(() => {
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    setSelectedDateInStore(dateStr);
    
    const loadPlanForDate = async () => {
      try {
        const response = await fetch(`/api/plan?date=${dateStr}`);
        if (response.ok) {
          const data = await response.json();
          setCurrentPlan(data.plan);
        }
      } catch (error) {
        console.error('Error loading plan:', error);
      }
    };
    
    loadPlanForDate();
  }, [selectedDate, setSelectedDateInStore, setCurrentPlan]);

  const tasks = currentPlan?.tasks || [];

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsTaskDialogOpen(true);
  };

  const handleTaskUpdate = (taskId: string, updates: Partial<Task>) => {
    updateTask(taskId, updates);
  };

  const handleTaskDelete = (taskId: string) => {
    removeTask(taskId);
  };

  return (
    <div className="h-screen flex flex-col">
      <header className="border-b bg-background px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold">FlowMate</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </div>
            <Button variant="outline" size="sm">
              Generate Plan
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <aside className="w-[30%] border-r bg-muted/10 p-6 overflow-auto">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Calendar</h2>
          </div>
          <ProductivityCalendar
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
          />
        </aside>

        <main className="w-[70%] p-6 overflow-auto">
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Daily Timeline</h2>
            <p className="text-sm text-muted-foreground">
              {tasks.length} tasks scheduled for today
            </p>
          </div>
          <div className="relative h-[calc(100vh-200px)] pl-20 pr-4">
            <DayTimeline
              date={selectedDate}
              tasks={tasks}
              userProfile={userProfile}
              onTaskClick={handleTaskClick}
              onTaskUpdate={handleTaskUpdate}
            />
          </div>
        </main>
      </div>

      <TaskEditDialog
        task={selectedTask}
        open={isTaskDialogOpen}
        onClose={() => {
          setIsTaskDialogOpen(false);
          setSelectedTask(null);
        }}
        onSave={handleTaskUpdate}
        onDelete={handleTaskDelete}
      />
    </div>
  );
}
