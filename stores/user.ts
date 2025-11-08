import { create } from 'zustand';
import { UserProfile, UserSettings } from '@/types/shared';

interface UserState {
  profile: UserProfile | null;
  settings: UserSettings | null;
  setProfile: (profile: UserProfile) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  setSettings: (settings: UserSettings) => void;
  updateSettings: (updates: Partial<UserSettings>) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  profile: null,
  settings: null,
  setProfile: (profile) => set({ profile }),
  updateProfile: (updates) =>
    set((state) => ({
      profile: state.profile ? { ...state.profile, ...updates } : null,
    })),
  setSettings: (settings) => set({ settings }),
  updateSettings: (updates) =>
    set((state) => ({
      settings: state.settings ? { ...state.settings, ...updates } : null,
    })),
  clearUser: () => set({ profile: null, settings: null }),
}));
