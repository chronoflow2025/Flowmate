import { UserProfile, Task, DailyPlan, Feedback, ProductivityScore, ActivityPattern, UserSettings } from '@/types/shared';

export const mockUserProfile: UserProfile = {
  userId: 'mock-user-123',
  occupation: 'Software Developer',
  focusScale: 7,
  peakHours: ['09:00', '10:00', '14:00', '15:00'],
  habits: ['Morning Exercise', 'Coffee Break', 'Afternoon Walk', 'Reading'],
  routine: 'Early bird - most productive in mornings',
  colorGradient: {
    low: '#93c5fd',
    high: '#3b82f6',
  },
  createdAt: '2025-11-01T00:00:00Z',
  updatedAt: '2025-11-08T00:00:00Z',
};

export const mockTasks: Task[] = [
  {
    id: 'task-1',
    time: '09:00',
    duration: 90,
    title: 'Code review and PR merges',
    priority: 4.0,
    completed: true,
    source: 'ai',
  },
  {
    id: 'task-2',
    time: '10:30',
    duration: 60,
    title: 'Team standup meeting',
    priority: 2.5,
    completed: true,
    source: 'calendar',
  },
  {
    id: 'task-3',
    time: '11:30',
    duration: 120,
    title: 'Feature development - User dashboard',
    priority: 5.0,
    completed: false,
    source: 'ai',
  },
  {
    id: 'task-4',
    time: '13:30',
    duration: 30,
    title: 'Lunch break',
    priority: 1.0,
    completed: false,
    source: 'user',
  },
  {
    id: 'task-5',
    time: '14:00',
    duration: 90,
    title: 'Documentation update',
    priority: 3.0,
    completed: false,
    source: 'ai',
  },
  {
    id: 'task-6',
    time: '15:30',
    duration: 60,
    title: 'Bug fixing - Authentication flow',
    priority: 4.5,
    completed: false,
    source: 'user',
  },
];

export const mockDailyPlan: DailyPlan = {
  date: new Date().toISOString().split('T')[0],
  tasks: mockTasks,
  generatedAt: new Date().toISOString(),
  lastModified: new Date().toISOString(),
};

export const mockFeedback: Feedback[] = [
  {
    taskId: 'task-1',
    focusRating: 8,
    completionPercent: 95,
    textFeedback: 'Productive session, completed all PRs',
    timestamp: '2025-11-08T10:30:00Z',
    taskDate: '2025-11-08',
  },
  {
    taskId: 'task-2',
    focusRating: 6,
    completionPercent: 100,
    textFeedback: 'Good meeting, clear action items',
    timestamp: '2025-11-08T11:30:00Z',
    taskDate: '2025-11-08',
  },
];

export const mockProductivityScores: ProductivityScore[] = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - i));
  const score = 50 + Math.random() * 40;
  
  return {
    date: date.toISOString().split('T')[0],
    score: Math.round(score),
    totalTasks: Math.floor(4 + Math.random() * 6),
    completedTasks: Math.floor(3 + Math.random() * 5),
    avgFocus: Math.round(5 + Math.random() * 4),
    avgCompletion: Math.round(60 + Math.random() * 35),
    calculatedAt: date.toISOString(),
  };
});

export const mockActivityPattern: ActivityPattern = {
  date: new Date().toISOString().split('T')[0],
  hourly: {
    '09': { focus: 8, activity: 'coding', completion: 90 },
    '10': { focus: 7, activity: 'meeting', completion: 100 },
    '11': { focus: 9, activity: 'coding', completion: 85 },
    '13': { focus: 5, activity: 'lunch', completion: 100 },
    '14': { focus: 7, activity: 'documentation', completion: 75 },
    '15': { focus: 8, activity: 'bug-fixing', completion: 80 },
  },
};

export const mockUserSettings: UserSettings = {
  notifications: {
    email: true,
    push: true,
    feedbackTiming: 2,
  },
  appearance: {
    darkMode: false,
    timeFormat: '12h',
    colorPreset: 'blue',
  },
  privacy: {
    dataCollection: true,
  },
};

export function generateMockTasks(date: string, count: number = 6): Task[] {
  const activities = [
    'Code review',
    'Feature development',
    'Team meeting',
    'Documentation',
    'Bug fixing',
    'Testing',
    'Planning session',
    'Client call',
    'Research',
    'Learning new tech',
  ];
  
  const validPriorities: Task['priority'][] = [1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0];
  const validSources: Task['source'][] = ['ai', 'user', 'calendar'];
  const validDurations = [30, 60, 90, 120];
  
  const tasks: Task[] = [];
  let currentTime = 9;
  
  for (let i = 0; i < count; i++) {
    const duration = validDurations[Math.floor(Math.random() * validDurations.length)];
    const priority = validPriorities[Math.floor(Math.random() * validPriorities.length)];
    const source = validSources[Math.floor(Math.random() * validSources.length)];
    
    tasks.push({
      id: `task-${date}-${i}`,
      time: `${currentTime.toString().padStart(2, '0')}:00`,
      duration,
      title: activities[Math.floor(Math.random() * activities.length)],
      priority,
      completed: Math.random() > 0.5,
      source,
    });
    
    currentTime += Math.floor(duration / 60) + 0.5;
    if (currentTime >= 17) break;
  }
  
  return tasks;
}
