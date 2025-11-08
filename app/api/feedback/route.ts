import { NextRequest } from 'next/server';
import { feedbackRepo, productivityRepo } from '@/lib/db/repository';
import { getUserId, unauthorized, badRequest, serverError, success } from '@/lib/api-utils';
import { Feedback } from '@/types/shared';

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId();
    
    if (!userId) {
      return unauthorized();
    }

    const body = await request.json();
    
    if (!body.taskId || body.focusRating === undefined || body.completionPercent === undefined) {
      return badRequest('Missing required feedback fields');
    }

    const feedback: Feedback = {
      taskId: body.taskId,
      focusRating: body.focusRating,
      completionPercent: body.completionPercent,
      textFeedback: body.textFeedback,
      timestamp: new Date().toISOString(),
      taskDate: body.taskDate || new Date().toISOString().split('T')[0],
    };

    const result = await feedbackRepo.saveFeedback(userId, body.taskId, feedback);
    
    if (!result.ok) {
      return serverError('Failed to save feedback');
    }

    return success({ feedback, message: 'Feedback submitted successfully' }, 201);
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return serverError();
  }
}

export async function GET() {
  try {
    const userId = await getUserId();
    
    if (!userId) {
      return unauthorized();
    }

    const result = await feedbackRepo.getAllUserFeedback(userId);
    
    if (!result.ok) {
      return serverError('Failed to fetch feedback');
    }

    return success(result.value || []);
  } catch (error) {
    console.error('Error fetching feedback:', error);
    return serverError();
  }
}
