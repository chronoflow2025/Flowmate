import { NextRequest } from 'next/server';
import { userRepo } from '@/lib/db/repository';
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

    return success({ profile, message: 'Onboarding completed successfully' }, 201);
  } catch (error) {
    console.error('Error processing onboarding:', error);
    return serverError();
  }
}
