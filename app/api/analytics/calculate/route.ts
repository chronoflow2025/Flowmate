import { NextRequest } from 'next/server';
import { getUserId, unauthorized, badRequest, serverError, success } from '@/lib/api-utils';
import { feedbackRepo, productivityRepo, activityRepo } from '@/lib/db/repository';
import { calculateProductivityScore, generateActivityPattern } from '@/lib/ai';

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

    const feedbackResult = await feedbackRepo.getAllUserFeedback(userId);
    
    if (!feedbackResult.ok) {
      return serverError('Failed to fetch feedback data');
    }

    const allFeedback = feedbackResult.value || [];

    const productivityScore = calculateProductivityScore(date, allFeedback);
    await productivityRepo.saveScore(userId, date, productivityScore);

    const activityPattern = generateActivityPattern(date, allFeedback);
    await activityRepo.saveActivity(userId, date, activityPattern);

    return success({
      productivityScore,
      activityPattern,
      message: 'Analytics calculated successfully',
    }, 201);
  } catch (error) {
    console.error('Error calculating analytics:', error);
    return serverError();
  }
}
