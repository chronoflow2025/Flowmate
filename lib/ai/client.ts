import { GoogleGenerativeAI } from '@google/generative-ai';

class GeminiClient {
  private static instance: GoogleGenerativeAI | null = null;
  private static rateLimiter: {
    requests: number[];
    maxRequests: number;
    windowMs: number;
  } = {
    requests: [],
    maxRequests: 15,
    windowMs: 60000,
  };

  private constructor() {}

  static getInstance(): GoogleGenerativeAI {
    if (!GeminiClient.instance) {
      const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('GOOGLE_GEMINI_API_KEY is not configured');
      }
      GeminiClient.instance = new GoogleGenerativeAI(apiKey);
    }
    return GeminiClient.instance;
  }

  static async checkRateLimit(): Promise<boolean> {
    const now = Date.now();
    this.rateLimiter.requests = this.rateLimiter.requests.filter(
      (timestamp) => now - timestamp < this.rateLimiter.windowMs
    );

    if (this.rateLimiter.requests.length >= this.rateLimiter.maxRequests) {
      return false;
    }

    this.rateLimiter.requests.push(now);
    return true;
  }

  static resetRateLimit(): void {
    this.rateLimiter.requests = [];
  }
}

export const getGenAI = () => GeminiClient.getInstance();
export const checkRateLimit = () => GeminiClient.checkRateLimit();
export const resetRateLimit = () => GeminiClient.resetRateLimit();
