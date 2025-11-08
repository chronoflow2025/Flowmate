import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  userId: string | null;
  isGuest: boolean;
  setAuth: (userId: string, isGuest: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  userId: null,
  isGuest: false,
  setAuth: (userId: string, isGuest: boolean) =>
    set({ isAuthenticated: true, userId, isGuest }),
  logout: () => set({ isAuthenticated: false, userId: null, isGuest: false }),
}));
