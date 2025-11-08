import { NextRequest } from 'next/server';
import { planRepo, userRepo, feedbackRepo, activityRepo } from '@/lib/db/repository';
import { getUserId, unauthorized, badRequest, serverError, success } from '@/lib/api-utils';
import { DailyPlan, Task } from '@/types/shared';
import { generateMockTasks } from '@/lib/mock-data';
import { generateDailyPlan } from '@/lib/ai';

const USE_MOCK_AI = process.env.NEXT_PUBLIC_MOCK_AI === 'true';

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId();
    
    if (!userId) {
      return unauthorized();
    }

    const body = await request.json();
    const { date } = body;
    
    if (!date) {
      return badRequest('Date is required');
    }

    const profileResult = await userRepo.getProfile(userId);
    
    if (!profileResult.ok) {
      return badRequest('User profile not found. Complete onboarding first.');
    }

    let tasks: Task[];

    if (USE_MOCK_AI) {
      tasks = generateMockTasks(date, 6);
    } else {
      const feedbackResult = await feedbackRepo.getAllUserFeedback(userId);
      const historicalFeedback = feedbackResult.ok && feedbackResult.value ? feedbackResult.value : [];

      const activitiesListResult = await activityRepo.listUserActivities(userId);
      const activityPatterns = [];
      
      if (activitiesListResult.ok && activitiesListResult.value) {
        const recentActivityKeys = activitiesListResult.value.slice(-7);
        for (const key of recentActivityKeys) {
          const activityDate = key.split(':').pop();
          if (activityDate) {
            const activityResult = await activityRepo.getActivity(userId, activityDate);
            if (activityResult.ok && activityResult.value) {
              activityPatterns.push(activityResult.value);
            }
          }
        }
      }

      const aiResult = await generateDailyPlan(
        profileResult.value,
        historicalFeedback,
        activityPatterns,
        date
      );

      if (aiResult.error) {
        return serverError(aiResult.error);
      }

      tasks = aiResult.data || [];
    }
    
    const plan: DailyPlan = {
      date,
      tasks,
      generatedAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
    };

    const result = await planRepo.savePlan(userId, date, plan);
    
    if (!result.ok) {
      return serverError('Failed to save generated plan');
    }

    return success({ 
      plan,
      message: USE_MOCK_AI 
        ? 'Plan generated successfully (using mock AI - set NEXT_PUBLIC_MOCK_AI=false for real AI)'
        : 'Plan generated successfully with AI'
    }, 201);
  } catch (error) {
    console.error('Error generating plan:', error);
    return serverError();
  }
}
