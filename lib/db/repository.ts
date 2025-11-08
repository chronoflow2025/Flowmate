import { UserProfile, DailyPlan, Feedback, ProductivityScore, ActivityPattern, UserSettings } from '@/types/shared';
import { safeGet, safeSet, safeDelete, safeList, DBResult } from './client';

export class UserRepository {
  private getProfileKey(userId: string): string {
    return `user:${userId}:profile`;
  }

  async getProfile(userId: string): Promise<DBResult<UserProfile>> {
    return safeGet<UserProfile>(this.getProfileKey(userId));
  }

  async saveProfile(userId: string, profile: UserProfile): Promise<DBResult<null>> {
    return safeSet(this.getProfileKey(userId), profile);
  }

  async deleteProfile(userId: string): Promise<DBResult<null>> {
    return safeDelete(this.getProfileKey(userId));
  }
}

export class PlanRepository {
  private getPlanKey(userId: string, date: string): string {
    return `user:${userId}:plan:${date}`;
  }

  async getPlan(userId: string, date: string): Promise<DBResult<DailyPlan>> {
    return safeGet<DailyPlan>(this.getPlanKey(userId, date));
  }

  async savePlan(userId: string, date: string, plan: DailyPlan): Promise<DBResult<null>> {
    return safeSet(this.getPlanKey(userId, date), plan);
  }

  async deletePlan(userId: string, date: string): Promise<DBResult<null>> {
    return safeDelete(this.getPlanKey(userId, date));
  }

  async listUserPlans(userId: string): Promise<DBResult<string[]>> {
    return safeList(`user:${userId}:plan:`);
  }
}

export class FeedbackRepository {
  private getFeedbackKey(userId: string, taskId: string): string {
    return `user:${userId}:feedback:${taskId}`;
  }

  async getFeedback(userId: string, taskId: string): Promise<DBResult<Feedback>> {
    return safeGet<Feedback>(this.getFeedbackKey(userId, taskId));
  }

  async saveFeedback(userId: string, taskId: string, feedback: Feedback): Promise<DBResult<null>> {
    return safeSet(this.getFeedbackKey(userId, taskId), feedback);
  }

  async listUserFeedback(userId: string): Promise<DBResult<string[]>> {
    return safeList(`user:${userId}:feedback:`);
  }

  async getAllUserFeedback(userId: string): Promise<DBResult<Feedback[]>> {
    const keysResult = await this.listUserFeedback(userId);
    
    if (!keysResult.ok || !keysResult.value) {
      return { ok: false, error: keysResult.error };
    }

    const feedbackList: Feedback[] = [];
    
    for (const key of keysResult.value) {
      const taskId = key.split(':').pop();
      if (taskId) {
        const result = await this.getFeedback(userId, taskId);
        if (result.ok && result.value) {
          feedbackList.push(result.value);
        }
      }
    }

    return { ok: true, value: feedbackList };
  }
}

export class ProductivityRepository {
  private getScoreKey(userId: string, date: string): string {
    return `user:${userId}:score:${date}`;
  }

  async getScore(userId: string, date: string): Promise<DBResult<ProductivityScore>> {
    return safeGet<ProductivityScore>(this.getScoreKey(userId, date));
  }

  async saveScore(userId: string, date: string, score: ProductivityScore): Promise<DBResult<null>> {
    return safeSet(this.getScoreKey(userId, date), score);
  }

  async listUserScores(userId: string): Promise<DBResult<string[]>> {
    return safeList(`user:${userId}:score:`);
  }
}

export class ActivityRepository {
  private getActivityKey(userId: string, date: string): string {
    return `user:${userId}:activity:${date}`;
  }

  async getActivity(userId: string, date: string): Promise<DBResult<ActivityPattern>> {
    return safeGet<ActivityPattern>(this.getActivityKey(userId, date));
  }

  async saveActivity(userId: string, date: string, activity: ActivityPattern): Promise<DBResult<null>> {
    return safeSet(this.getActivityKey(userId, date), activity);
  }

  async listUserActivities(userId: string): Promise<DBResult<string[]>> {
    return safeList(`user:${userId}:activity:`);
  }
}

export class SettingsRepository {
  private getSettingsKey(userId: string): string {
    return `user:${userId}:settings`;
  }

  async getSettings(userId: string): Promise<DBResult<UserSettings>> {
    return safeGet<UserSettings>(this.getSettingsKey(userId));
  }

  async saveSettings(userId: string, settings: UserSettings): Promise<DBResult<null>> {
    return safeSet(this.getSettingsKey(userId), settings);
  }
}

export const userRepo = new UserRepository();
export const planRepo = new PlanRepository();
export const feedbackRepo = new FeedbackRepository();
export const productivityRepo = new ProductivityRepository();
export const activityRepo = new ActivityRepository();
export const settingsRepo = new SettingsRepository();
