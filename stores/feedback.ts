import { create } from 'zustand';
import { Feedback } from '@/types/shared';

interface FeedbackState {
  pendingFeedback: { taskId: string; taskTitle: string; endTime: string } | null;
  recentFeedback: Feedback[];
  setPendingFeedback: (feedback: { taskId: string; taskTitle: string; endTime: string } | null) => void;
  submitFeedback: (feedback: Feedback) => void;
  clearPendingFeedback: () => void;
  loadRecentFeedback: (feedback: Feedback[]) => void;
}

export const useFeedbackStore = create<FeedbackState>((set) => ({
  pendingFeedback: null,
  recentFeedback: [],
  setPendingFeedback: (feedback) => set({ pendingFeedback: feedback }),
  submitFeedback: (feedback) =>
    set((state) => ({
      recentFeedback: [feedback, ...state.recentFeedback].slice(0, 50),
      pendingFeedback: null,
    })),
  clearPendingFeedback: () => set({ pendingFeedback: null }),
  loadRecentFeedback: (feedback) => set({ recentFeedback: feedback }),
}));
