import { create } from 'zustand';
import { DailyPlan, Task } from '@/types/shared';

interface PlanState {
  currentPlan: DailyPlan | null;
  selectedDate: string;
  isLoading: boolean;
  setCurrentPlan: (plan: DailyPlan) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  addTask: (task: Task) => void;
  removeTask: (taskId: string) => void;
  setSelectedDate: (date: string) => void;
  setLoading: (isLoading: boolean) => void;
  clearPlan: () => void;
}

export const usePlanStore = create<PlanState>((set) => ({
  currentPlan: null,
  selectedDate: new Date().toISOString().split('T')[0],
  isLoading: false,
  setCurrentPlan: (plan) => set({ currentPlan: plan }),
  updateTask: (taskId, updates) =>
    set((state) => ({
      currentPlan: state.currentPlan
        ? {
            ...state.currentPlan,
            tasks: state.currentPlan.tasks.map((task) =>
              task.id === taskId ? { ...task, ...updates } : task
            ),
            lastModified: new Date().toISOString(),
          }
        : null,
    })),
  addTask: (task) =>
    set((state) => ({
      currentPlan: state.currentPlan
        ? {
            ...state.currentPlan,
            tasks: [...state.currentPlan.tasks, task],
            lastModified: new Date().toISOString(),
          }
        : null,
    })),
  removeTask: (taskId) =>
    set((state) => ({
      currentPlan: state.currentPlan
        ? {
            ...state.currentPlan,
            tasks: state.currentPlan.tasks.filter((task) => task.id !== taskId),
            lastModified: new Date().toISOString(),
          }
        : null,
    })),
  setSelectedDate: (date) => set({ selectedDate: date }),
  setLoading: (isLoading) => set({ isLoading }),
  clearPlan: () => set({ currentPlan: null }),
}));
