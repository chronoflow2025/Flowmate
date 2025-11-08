import { NextRequest } from 'next/server';
import { userRepo } from '@/lib/db/repository';
import { getUserId, unauthorized, notFound, serverError, success } from '@/lib/api-utils';
import { UserProfile } from '@/types/shared';

export async function GET() {
  try {
    const userId = await getUserId();
    
    if (!userId) {
      return unauthorized();
    }

    const result = await userRepo.getProfile(userId);
    
    if (!result.ok) {
      if (result.error === 'Key not found') {
        return notFound('User profile not found');
      }
      console.error('Database error:', result.error);
      return serverError('Failed to fetch user profile');
    }

    return success(result.value);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return serverError();
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userId = await getUserId();
    
    if (!userId) {
      return unauthorized();
    }

    const body = await request.json();
    
    const profile: UserProfile = {
      userId,
      occupation: body.occupation,
      focusScale: body.focusScale,
      peakHours: body.peakHours,
      habits: body.habits,
      routine: body.routine,
      colorGradient: body.colorGradient,
      createdAt: body.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const result = await userRepo.saveProfile(userId, profile);
    
    if (!result.ok) {
      return serverError('Failed to save user profile');
    }

    return success(profile);
  } catch (error) {
    console.error('Error updating user profile:', error);
    return serverError();
  }
}
