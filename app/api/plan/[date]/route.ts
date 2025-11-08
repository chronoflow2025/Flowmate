import { NextRequest } from 'next/server';
import { planRepo } from '@/lib/db/repository';
import { getUserId, unauthorized, notFound, serverError, success } from '@/lib/api-utils';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ date: string }> }
) {
  try {
    const userId = await getUserId();
    
    console.log('userId', userId);
    
    if (!userId) {
      return unauthorized();
    }

    const { date } = await params;

    const result = await planRepo.getPlan(userId, date);
    
    if (!result.ok) {
      if (result.error === 'Key not found') {
        return notFound('Plan not found for this date');
      }
      console.error('Database error:', result.error);
      return serverError('Failed to fetch plan');
    }

    return success(result.value);
  } catch (error) {
    console.error('Error fetching plan:', error);
    return serverError();
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ date: string }> }
) {
  try {
    const userId = await getUserId();
    
    if (!userId) {
      return unauthorized();
    }

    const { date } = await params;
    const body = await request.json();

    const plan = {
      ...body,
      date,
      lastModified: new Date().toISOString(),
    };

    const result = await planRepo.savePlan(userId, date, plan);
    
    if (!result.ok) {
      return serverError('Failed to update plan');
    }

    return success(plan);
  } catch (error) {
    console.error('Error updating plan:', error);
    return serverError();
  }
}
