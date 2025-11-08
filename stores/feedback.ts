import { create } from 'zustand';
import { Feedback, ProductivityScore } from '@/types/shared';

interface FeedbackState {
  pendingFeedback: { taskId: string; taskTitle: string; endTime: string } | null;
  recentFeedback: Feedback[];
  setPendingFeedback: (feedback: { taskId: string; taskTitle: string; endTime: string } | null) => void;
  submitFeedback: (feedback: Feedback) => void;
  clearPendingFeedback: () => void;
  loadRecentFeedback: (feedback: Feedback[]) => void;
}

interface ProductivityScoresState {
  scores: Record<string, ProductivityScore>;
  setScores: (scores: Record<string, ProductivityScore>) => void;
  updateScore: (date: string, score: ProductivityScore) => void;
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

export const useProductivityScores = create<ProductivityScoresState>((set) => ({
  scores: {},
  setScores: (scores) => set({ scores }),
  updateScore: (date, score) =>
    set((state) => ({
      scores: { ...state.scores, [date]: score },
    })),
}));
