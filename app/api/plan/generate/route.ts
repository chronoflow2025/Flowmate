import { NextRequest } from 'next/server';
import { planRepo, userRepo, feedbackRepo, activityRepo } from '@/lib/db/repository';
import { getUserId, unauthorized, badRequest, serverError, success } from '@/lib/api-utils';
import { DailyPlan, Task } from '@/types/shared';
import { generateMockTasks } from '@/lib/mock-data';

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

    const mockTasks = generateMockTasks(date, 6);
    
    const plan: DailyPlan = {
      date,
      tasks: mockTasks,
      generatedAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
    };

    const result = await planRepo.savePlan(userId, date, plan);
    
    if (!result.ok) {
      return serverError('Failed to save generated plan');
    }

    return success({ 
      plan,
      message: 'Plan generated successfully (using mock AI - Phase 4 will implement real AI)'
    }, 201);
  } catch (error) {
    console.error('Error generating plan:', error);
    return serverError();
  }
}
