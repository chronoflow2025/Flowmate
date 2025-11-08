import { getGenAI, checkRateLimit } from './client';
import { buildPlanGenerationPrompt, parseTasksFromAIResponse } from './prompts';
import { UserProfile, Feedback, ActivityPattern, Task, APIResponse } from '@/types/shared';

export async function generateDailyPlan(
  profile: UserProfile,
  historicalFeedback: Feedback[],
  activityPatterns: ActivityPattern[],
  targetDate: string
): Promise<APIResponse<Task[]>> {
  try {
    const canProceed = await checkRateLimit();
    if (!canProceed) {
      return {
        error: 'Rate limit exceeded. Please try again in a minute.',
        code: 'RATE_LIMIT_EXCEEDED',
      };
    }

    const prompt = buildPlanGenerationPrompt(
      profile,
      historicalFeedback,
      activityPatterns,
      targetDate
    );

    const genAI = getGenAI();
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    const tasks = parseTasksFromAIResponse(text);

    return {
      data: tasks,
    };
  } catch (error) {
    console.error('Error generating daily plan:', error);
    return {
      error: error instanceof Error ? error.message : 'Failed to generate plan',
      code: 'GENERATION_ERROR',
    };
  }
}

export async function streamChatResponse(
  userMessage: string,
  profile: UserProfile,
  currentPlan: Task[],
  onChunk: (text: string) => void
): Promise<APIResponse<string>> {
  try {
    const canProceed = await checkRateLimit();
    if (!canProceed) {
      return {
        error: 'Rate limit exceeded. Please try again in a minute.',
        code: 'RATE_LIMIT_EXCEEDED',
      };
    }

    const { buildChatPrompt } = await import('./prompts');
    const prompt = buildChatPrompt(userMessage, profile, currentPlan);

    const genAI = getGenAI();
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContentStream(prompt);

    let fullText = '';
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      fullText += chunkText;
      onChunk(chunkText);
    }

    return {
      data: fullText,
    };
  } catch (error) {
    console.error('Error streaming chat response:', error);
    return {
      error: error instanceof Error ? error.message : 'Failed to generate response',
      code: 'CHAT_ERROR',
    };
  }
}
