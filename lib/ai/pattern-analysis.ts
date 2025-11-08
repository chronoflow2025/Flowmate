import { Feedback, ProductivityScore, ActivityPattern, HourlyActivity } from '@/types/shared';

export function calculateProductivityScore(
  date: string,
  feedbackList: Feedback[]
): ProductivityScore {
  const dateFeedback = feedbackList.filter(f => f.taskDate === date);
  
  if (dateFeedback.length === 0) {
    return {
      date,
      score: 0,
      totalTasks: 0,
      completedTasks: 0,
      avgFocus: 0,
      avgCompletion: 0,
      calculatedAt: new Date().toISOString(),
    };
  }

  const totalTasks = dateFeedback.length;
  const completedTasks = dateFeedback.filter(f => f.completionPercent >= 80).length;
  const avgFocus = dateFeedback.reduce((sum, f) => sum + f.focusRating, 0) / totalTasks;
  const avgCompletion = dateFeedback.reduce((sum, f) => sum + f.completionPercent, 0) / totalTasks;
  
  const score = (avgFocus / 10) * 0.5 + (avgCompletion / 100) * 0.5;
  const normalizedScore = score * 100;

  return {
    date,
    score: Math.round(normalizedScore * 10) / 10,
    totalTasks,
    completedTasks,
    avgFocus: Math.round(avgFocus * 10) / 10,
    avgCompletion: Math.round(avgCompletion),
    calculatedAt: new Date().toISOString(),
  };
}

export function generateActivityPattern(
  date: string,
  feedbackList: Feedback[]
): ActivityPattern {
  const dateFeedback = feedbackList.filter(f => f.taskDate === date);
  
  const hourly: Record<string, HourlyActivity> = {};

  for (let hour = 0; hour < 24; hour++) {
    const hourStr = hour.toString().padStart(2, '0');
    
    const hourFeedback = dateFeedback.filter(f => {
      const taskHour = parseInt(f.taskId.split('-')[1] || '0');
      return taskHour === hour;
    });

    if (hourFeedback.length > 0) {
      const avgFocus = hourFeedback.reduce((sum, f) => sum + f.focusRating, 0) / hourFeedback.length;
      const avgCompletion = hourFeedback.reduce((sum, f) => sum + f.completionPercent, 0) / hourFeedback.length;
      
      const activity = determineActivity(avgFocus, avgCompletion);
      
      hourly[hourStr] = {
        focus: Math.round(avgFocus * 10) / 10,
        completion: Math.round(avgCompletion),
        activity,
      };
    } else {
      hourly[hourStr] = {
        focus: 0,
        completion: 0,
        activity: 'idle',
      };
    }
  }

  return {
    date,
    hourly,
  };
}

function determineActivity(focus: number, completion: number): string {
  if (focus >= 7 && completion >= 80) {
    return 'peak-productivity';
  } else if (focus >= 5 && completion >= 60) {
    return 'moderate-work';
  } else if (focus < 5 || completion < 50) {
    return 'low-productivity';
  } else {
    return 'steady-work';
  }
}

export function aggregateFeedbackInsights(feedbackList: Feedback[]): {
  overallFocus: number;
  overallCompletion: number;
  bestHours: string[];
  worstHours: string[];
  totalFeedback: number;
} {
  if (feedbackList.length === 0) {
    return {
      overallFocus: 0,
      overallCompletion: 0,
      bestHours: [],
      worstHours: [],
      totalFeedback: 0,
    };
  }

  const overallFocus = feedbackList.reduce((sum, f) => sum + f.focusRating, 0) / feedbackList.length;
  const overallCompletion = feedbackList.reduce((sum, f) => sum + f.completionPercent, 0) / feedbackList.length;

  const hourlyPerformance: Record<string, { focus: number; completion: number; count: number }> = {};

  feedbackList.forEach(f => {
    const hour = f.taskId.split('-')[1] || '0';
    
    if (!hourlyPerformance[hour]) {
      hourlyPerformance[hour] = { focus: 0, completion: 0, count: 0 };
    }
    
    hourlyPerformance[hour].focus += f.focusRating;
    hourlyPerformance[hour].completion += f.completionPercent;
    hourlyPerformance[hour].count += 1;
  });

  const hourlyAverages = Object.entries(hourlyPerformance)
    .map(([hour, data]) => ({
      hour,
      avgFocus: data.focus / data.count,
      avgCompletion: data.completion / data.count,
      avgScore: ((data.focus / data.count) / 10 + (data.completion / data.count) / 100) / 2,
    }))
    .sort((a, b) => b.avgScore - a.avgScore);

  const bestHours = hourlyAverages.slice(0, 3).map(h => `${h.hour}:00`);
  const worstHours = hourlyAverages.slice(-3).reverse().map(h => `${h.hour}:00`);

  return {
    overallFocus: Math.round(overallFocus * 10) / 10,
    overallCompletion: Math.round(overallCompletion),
    bestHours,
    worstHours,
    totalFeedback: feedbackList.length,
  };
}
