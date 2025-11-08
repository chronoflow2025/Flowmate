/**
 * SHARED TYPE DEFINITIONS
 * 
 * ⚠️ IMPORTANT: These types are used across ALL phases.
 * Any changes must be coordinated with all phase owners.
 * 
 * Last updated: November 8, 2025
 */

export interface UserProfile {
  userId: string;
  occupation: string;
  focusScale: number;
  peakHours: string[];
  habits: string[];
  routine: string;
  colorGradient: {
    low: string;
    high: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  time: string;
  duration: number;
  title: string;
  priority: number;
  completed: boolean;
  source: 'ai' | 'user' | 'calendar';
}

export interface DailyPlan {
  date: string;
  tasks: Task[];
  generatedAt: string;
  lastModified: string;
}

export interface Feedback {
  taskId: string;
  focusRating: number;
  completionPercent: number;
  textFeedback?: string;
  timestamp: string;
  taskDate: string;
}

export interface ProductivityScore {
  date: string;
  score: number;
  totalTasks: number;
  completedTasks: number;
  avgFocus: number;
  avgCompletion: number;
  calculatedAt: string;
}

export interface HourlyActivity {
  focus: number;
  activity: string;
  completion: number;
}

export interface ActivityPattern {
  date: string;
  hourly: Record<string, HourlyActivity>;
}

export interface UserSettings {
  notifications: {
    email: boolean;
    push: boolean;
    feedbackTiming: number;
  };
  appearance: {
    darkMode: boolean;
    timeFormat: '12h' | '24h';
    colorPreset: string;
  };
  privacy: {
    dataCollection: boolean;
  };
}

export interface OnboardingData {
  occupation: string;
  wakeTime: string;
  sleepTime: string;
  habits: string[];
  focusScale: number;
  peakHours: string[];
}

export interface AIGenerationContext {
  profile: UserProfile;
  historicalFeedback: Feedback[];
  calendarEvents?: any[];
  activityPatterns: ActivityPattern[];
}

export interface AIChatCommand {
  action: 'generate' | 'move' | 'add' | 'delete' | 'adjust';
  taskId?: string;
  newTime?: string;
  task?: Partial<Task>;
}

export interface APIResponse<T> {
  data?: T;
  error?: string;
  code?: string;
  details?: any;
}

export type PriorityLevel = 1.0 | 1.5 | 2.0 | 2.5 | 3.0 | 3.5 | 4.0 | 4.5 | 5.0;

export type ProductivityBadge = 'excellent' | 'good' | 'average' | 'needs-work';

export function getProductivityBadge(score: number): ProductivityBadge {
  if (score >= 90) return 'excellent';
  if (score >= 70) return 'good';
  if (score >= 50) return 'average';
  return 'needs-work';
}

export function getBadgeColor(badge: ProductivityBadge): string {
  switch (badge) {
    case 'excellent': return '#10b981';
    case 'good': return '#f59e0b';
    case 'average': return '#f97316';
    case 'needs-work': return '#ef4444';
  }
}

export function getPriorityColor(priority: number, gradient: UserProfile['colorGradient']): string {
  const { low, high } = gradient;
  const ratio = (priority - 1) / 4;
  return interpolateColor(low, high, ratio);
}

function interpolateColor(color1: string, color2: string, ratio: number): string {
  const hex = (color: string) => parseInt(color.slice(1), 16);
  const r1 = (hex(color1) >> 16) & 255;
  const g1 = (hex(color1) >> 8) & 255;
  const b1 = hex(color1) & 255;
  const r2 = (hex(color2) >> 16) & 255;
  const g2 = (hex(color2) >> 8) & 255;
  const b2 = hex(color2) & 255;
  const r = Math.round(r1 + (r2 - r1) * ratio);
  const g = Math.round(g1 + (g2 - g1) * ratio);
  const b = Math.round(b1 + (b2 - b1) * ratio);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}
