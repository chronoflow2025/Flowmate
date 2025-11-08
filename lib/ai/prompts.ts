import { UserProfile, Feedback, ActivityPattern, Task } from '@/types/shared';

export function buildPlanGenerationPrompt(
  profile: UserProfile,
  historicalFeedback: Feedback[],
  activityPatterns: ActivityPattern[],
  targetDate: string
): string {
  const feedbackSummary = summarizeFeedback(historicalFeedback);
  const patternSummary = summarizePatterns(activityPatterns);

  return `You are an AI assistant helping to generate a personalized daily productivity plan.

## User Profile
- Occupation: ${profile.occupation}
- Focus Capacity (1-10): ${profile.focusScale}
- Peak Performance Hours: ${profile.peakHours.join(', ')}
- Daily Habits: ${profile.habits.join(', ')}
- Daily Routine: ${profile.routine}

## Historical Performance Insights
${feedbackSummary}

## Activity Patterns
${patternSummary}

## Task
Generate a detailed daily plan for ${targetDate}. The plan should:
1. Schedule high-priority tasks during peak performance hours (${profile.peakHours.join(', ')})
2. Consider the user's focus capacity of ${profile.focusScale}/10
3. Balance work periods with breaks based on historical feedback
4. Account for recurring habits: ${profile.habits.join(', ')}
5. Learn from past performance patterns
6. Include realistic time blocks (minimum 15 minutes, maximum 3 hours)
7. Provide 8-12 tasks throughout the day

## Output Format (JSON)
Return ONLY a valid JSON array of tasks with this exact structure:
[
  {
    "time": "09:00",
    "duration": 60,
    "title": "Task description",
    "priority": 3.5
  }
]

Priority scale: 1.0 (lowest) to 5.0 (highest). Use decimals (e.g., 2.5, 3.0, 4.5).
Times in 24-hour format. Duration in minutes.

Generate the plan now:`;
}

export function buildChatPrompt(
  userMessage: string,
  profile: UserProfile,
  currentPlan: Task[]
): string {
  return `You are FlowMate AI, a productivity assistant helping to manage daily tasks.

## User Profile
- Occupation: ${profile.occupation}
- Focus Capacity: ${profile.focusScale}/10
- Peak Hours: ${profile.peakHours.join(', ')}

## Current Plan (${currentPlan.length} tasks)
${currentPlan.map((t, i) => `${i + 1}. ${t.time} - ${t.title} (${t.duration}min, priority ${t.priority})`).join('\n')}

## User Message
"${userMessage}"

## Your Role
- Parse commands like: "generate tomorrow's plan", "move task to 3pm", "add meeting at 2pm"
- Provide helpful, concise responses
- For plan generation, return structured data (see format below)
- For modifications, explain what will happen
- Be friendly but professional

## Command Detection
If the user wants to:
- Generate a plan: Return JSON array of tasks
- Move a task: Identify task and new time
- Add a task: Extract task details
- Delete a task: Identify task to remove
- General question: Answer naturally

Respond to the user now:`;
}

function summarizeFeedback(feedback: Feedback[]): string {
  if (feedback.length === 0) {
    return 'No historical feedback available yet.';
  }

  const avgFocus = feedback.reduce((sum, f) => sum + f.focusRating, 0) / feedback.length;
  const avgCompletion = feedback.reduce((sum, f) => sum + f.completionPercent, 0) / feedback.length;
  const recentFeedback = feedback.slice(-10);

  const insights = [];
  insights.push(`Average Focus Rating: ${avgFocus.toFixed(1)}/10`);
  insights.push(`Average Completion Rate: ${avgCompletion.toFixed(0)}%`);

  const lowFocusTasks = recentFeedback.filter(f => f.focusRating < 5);
  if (lowFocusTasks.length > 0) {
    insights.push(`Low focus reported in ${lowFocusTasks.length} recent tasks`);
  }

  const incompleteTasks = recentFeedback.filter(f => f.completionPercent < 70);
  if (incompleteTasks.length > 0) {
    insights.push(`${incompleteTasks.length} tasks with low completion rates`);
  }

  return insights.join('\n');
}

function summarizePatterns(patterns: ActivityPattern[]): string {
  if (patterns.length === 0) {
    return 'No activity patterns available yet.';
  }

  const recentPattern = patterns[patterns.length - 1];
  const hourlyData = Object.entries(recentPattern.hourly);

  const highProductivityHours = hourlyData
    .filter(([_, data]) => data.focus > 7 && data.completion > 80)
    .map(([hour]) => hour);

  const lowProductivityHours = hourlyData
    .filter(([_, data]) => data.focus < 5 || data.completion < 50)
    .map(([hour]) => hour);

  const insights = [];
  if (highProductivityHours.length > 0) {
    insights.push(`High productivity hours: ${highProductivityHours.join(', ')}`);
  }
  if (lowProductivityHours.length > 0) {
    insights.push(`Lower productivity hours: ${lowProductivityHours.join(', ')}`);
  }

  return insights.length > 0 ? insights.join('\n') : 'Building activity patterns...';
}

export function parseTasksFromAIResponse(response: string): Task[] {
  try {
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('No JSON array found in response');
    }

    const parsed = JSON.parse(jsonMatch[0]);
    
    if (!Array.isArray(parsed)) {
      throw new Error('Response is not an array');
    }

    return parsed.map((task, index) => ({
      id: `ai-${Date.now()}-${index}`,
      time: task.time,
      duration: task.duration,
      title: task.title,
      priority: task.priority,
      completed: false,
      source: 'ai' as const,
    }));
  } catch (error) {
    console.error('Failed to parse AI response:', error);
    throw new Error('Failed to parse AI-generated tasks');
  }
}
