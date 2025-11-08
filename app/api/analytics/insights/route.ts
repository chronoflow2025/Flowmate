import { NextRequest } from 'next/server';
import { getUserId, unauthorized, serverError, success } from '@/lib/api-utils';
import { feedbackRepo } from '@/lib/db/repository';
import { aggregateFeedbackInsights } from '@/lib/ai';

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserId();
    
    if (!userId) {
      return unauthorized();
    }

    const feedbackResult = await feedbackRepo.getAllUserFeedback(userId);
    
    if (!feedbackResult.ok) {
      return serverError('Failed to fetch feedback data');
    }

    const allFeedback = feedbackResult.value || [];
    const insights = aggregateFeedbackInsights(allFeedback);

    return success({ insights });
  } catch (error) {
    console.error('Error fetching insights:', error);
    return serverError();
  }
}
