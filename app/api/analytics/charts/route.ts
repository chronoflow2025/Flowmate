import { NextRequest } from 'next/server';
import { success } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  console.log('Analytics charts API called');
  
  const emptyData = {
    productivityTrend: [],
    weeklyHeatmap: [],
    hourlyActivity: [],
    focusVsCompletion: [],
    completionTrends: [],
    focusCompletionMatrix: {
      highFocusHighCompletion: 0,
      highFocusLowCompletion: 0,
      lowFocusHighCompletion: 0,
      lowFocusLowCompletion: 0,
    },
  };

  return success(emptyData);
}

