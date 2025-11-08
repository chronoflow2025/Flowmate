import { NextRequest } from 'next/server';
import { userRepo, planRepo, settingsRepo, activityRepo, productivityRepo, feedbackRepo } from '@/lib/db/repository';
import { createOrUpdateUserFromClerk } from '@/lib/db/models/user';
import { clerkClient } from '@clerk/nextjs/server';
import { getUserId, unauthorized, badRequest, serverError, success } from '@/lib/api-utils';
import { OnboardingData, UserProfile } from '@/types/shared';

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId();
    
    if (!userId) {
      return unauthorized();
    }

    const body: OnboardingData = await request.json();
    
    if (!body.occupation || !body.wakeTime || !body.sleepTime || !body.habits || !body.focusScale || !body.peakHours) {
      return badRequest('Missing required onboarding fields');
    }

    const profile: UserProfile = {
      userId,
      occupation: body.occupation,
      focusScale: body.focusScale,
      peakHours: body.peakHours,
      habits: body.habits,
      routine: `Wake: ${body.wakeTime}, Sleep: ${body.sleepTime}`,
      colorGradient: {
        low: '#93c5fd',
        high: '#3b82f6',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const result = await userRepo.saveProfile(userId, profile);
    
    if (!result.ok) {
      return serverError('Failed to save onboarding data');
    }

    // Create sample user settings
    const defaultSettings = {
      notifications: { email: true, push: true, feedbackTiming: 60 },
      appearance: { darkMode: false, timeFormat: '24h', colorPreset: 'blue' },
      privacy: { dataCollection: true },
    };

    const settingsResult = await settingsRepo.saveSettings(userId, defaultSettings as any);
    if (!settingsResult.ok) {
      console.error('Failed to save default settings:', settingsResult.error);
    }

    // Fetch Clerk user info (name + email) and persist in users collection
    try {
      // clerkClient typings may vary across versions; cast to any for runtime call
      const clerkUser = await (clerkClient as any).users.getUser(userId);
      const name = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ') || clerkUser.fullName || null;
      const email = clerkUser.emailAddresses && clerkUser.emailAddresses[0] ? clerkUser.emailAddresses[0].emailAddress : null;
      const created = await createOrUpdateUserFromClerk(userId, { name, email, routine: profile.routine });
      console.log('Created/updated user document for', userId, 'doc id:', created?._id);
    } catch (err) {
      // Not fatal — just log
      console.warn('Could not fetch/save Clerk user info:', err);
    }

    // Create sample plans for today and next 2 days
    const today = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    const formatDate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

    const sampleTasks = (dateStr: string) => ([
      { id: `task-${dateStr}-1`, time: '09:00', duration: 60, title: 'Morning planning', priority: 3, completed: false, source: 'ai' as const },
      { id: `task-${dateStr}-2`, time: '11:00', duration: 90, title: 'Deep work - Focus block', priority: 5, completed: false, source: 'ai' as const },
      { id: `task-${dateStr}-3`, time: '15:30', duration: 45, title: 'Email & admin', priority: 2, completed: false, source: 'ai' as const },
    ]);

    for (let i = 0; i < 3; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const dateStr = formatDate(d);
      const plan = {
        date: dateStr,
        tasks: sampleTasks(dateStr),
        generatedAt: new Date().toISOString(),
        lastModified: new Date().toISOString(),
      };

      const planRes = await planRepo.savePlan(userId, dateStr, plan as any);
      if (!planRes.ok) console.error('Failed to save sample plan', dateStr, planRes.error);
    }

    // Create a simple activity pattern for today
    const activityPattern = {
      date: formatDate(today),
      hourly: {
        '09': { focus: 80, activity: 'planning', completion: 0 },
        '10': { focus: 75, activity: 'deep-work', completion: 0 },
        '11': { focus: 85, activity: 'deep-work', completion: 0 },
        '15': { focus: 60, activity: 'admin', completion: 0 },
      },
    };
    const activityRes = await activityRepo.saveActivity(userId, activityPattern.date, activityPattern as any);
    if (!activityRes.ok) console.error('Failed to save activity pattern:', activityRes.error);

    // Create a productivity score for today
    const productivity = {
      date: formatDate(today),
      score: 80,
      totalTasks: 3,
      completedTasks: 0,
      avgFocus: 80,
      avgCompletion: 0,
      calculatedAt: new Date().toISOString(),
    };
    const prodRes = await productivityRepo.saveScore(userId, productivity.date, productivity as any);
    if (!prodRes.ok) console.error('Failed to save productivity score:', prodRes.error);

    // Save a sample feedback entry for the first sample task
    const sampleTaskId = `task-${formatDate(today)}-1`;
    const feedbackItem = {
      taskId: sampleTaskId,
      focusRating: 4,
      completionPercent: 0,
      textFeedback: 'This was helpful',
      timestamp: new Date().toISOString(),
      taskDate: formatDate(today),
    };
    const fbRes = await feedbackRepo.saveFeedback(userId, sampleTaskId, feedbackItem as any);
    if (!fbRes.ok) console.error('Failed to save sample feedback:', fbRes.error);

    return success({ profile, settings: defaultSettings, message: 'Onboarding completed successfully' }, 201);
  } catch (error) {
    console.error('Error processing onboarding:', error);
    return serverError();
  }
}
