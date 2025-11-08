import { NextRequest } from 'next/server';
import { getUserId, unauthorized, badRequest, serverError } from '@/lib/api-utils';
import { userRepo, planRepo } from '@/lib/db/repository';
import { streamChatResponse } from '@/lib/ai';
import { parseTasksFromAIResponse } from '@/lib/ai/prompts';
import { Task } from '@/types/shared';

const USE_MOCK_AI = process.env.NEXT_PUBLIC_MOCK_AI === 'true';

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId();
    
    if (!userId) {
      return unauthorized();
    }

    const body = await request.json();
    const { message, currentDate } = body;
    
    if (!message) {
      return badRequest('Message is required');
    }

    const profileResult = await userRepo.getProfile(userId);
    
    if (!profileResult.ok || !profileResult.value) {
      return badRequest('User profile not found. Complete onboarding first.');
    }

    let currentPlanTasks: Task[] = [];
    if (currentDate) {
      const planResult = await planRepo.getPlan(userId, currentDate);
      if (planResult.ok && planResult.value) {
        currentPlanTasks = planResult.value.tasks;
      }
    }

    if (USE_MOCK_AI) {
      const mockResponse = getMockChatResponse(message);
      return new Response(mockResponse, {
        headers: {
          'Content-Type': 'text/plain',
        },
      });
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          await streamChatResponse(
            message,
            profileResult.value!,
            currentPlanTasks,
            (chunk) => {
              controller.enqueue(encoder.encode(chunk));
            }
          );
          controller.close();
        } catch (error) {
          console.error('Streaming error:', error);
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain',
        'Transfer-Encoding': 'chunked',
      },
    });
  } catch (error) {
    console.error('Error in chat:', error);
    return serverError();
  }
}

function getMockChatResponse(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('generate') || lowerMessage.includes('plan') || lowerMessage.includes('tomorrow')) {
    return "I'll generate a personalized plan for you. Please use the 'Generate Plan' button to create your daily schedule based on your profile and historical performance.";
  }
  
  if (lowerMessage.includes('move') || lowerMessage.includes('reschedule')) {
    return "To move a task, you can drag and drop it on the timeline or edit it directly by clicking on the task block.";
  }
  
  if (lowerMessage.includes('add') || lowerMessage.includes('create')) {
    return "You can add new tasks by clicking on an empty time slot in your timeline. I'll help schedule it at an optimal time based on your productivity patterns.";
  }
  
  if (lowerMessage.includes('delete') || lowerMessage.includes('remove')) {
    return "To delete a task, click on it and select the delete option. Make sure you really want to remove it from your schedule!";
  }
  
  return "I'm here to help manage your daily schedule! You can ask me to generate plans, move tasks, or answer questions about your productivity. Try saying 'Generate tomorrow's plan' or 'Move my meeting to 3pm'.";
}
