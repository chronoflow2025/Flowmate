import { UserProfile as UserProfileType, DailyPlan as DailyPlanType, Feedback as FeedbackType, ProductivityScore as ProductivityScoreType, ActivityPattern as ActivityPatternType, UserSettings as UserSettingsType } from '@/types/shared';
import { DBResult, UserProfile, DailyPlan, Feedback, ProductivityScore, ActivityPattern, UserSettings } from './client';

export class UserRepository {
  async getProfile(userId: string): Promise<DBResult<UserProfileType>> {
    try {
      const profile = await UserProfile.findOne({ userId });
      if (!profile) {
        return { ok: false, error: 'Profile not found' };
      }
  return { ok: true, value: profile.toObject() as unknown as UserProfileType };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async saveProfile(userId: string, profile: UserProfileType): Promise<DBResult<null>> {
    try {
      await UserProfile.findOneAndUpdate(
        { userId },
        { ...profile, updatedAt: new Date() },
        { upsert: true }
      );
      return { ok: true };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async deleteProfile(userId: string): Promise<DBResult<null>> {
    try {
      await UserProfile.deleteOne({ userId });
      return { ok: true };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}

export class PlanRepository {
  async getPlan(userId: string, date: string): Promise<DBResult<DailyPlanType>> {
    try {
      const plan = await DailyPlan.findOne({ userId, date });
      if (!plan) {
        return { ok: false, error: 'Plan not found' };
      }
  return { ok: true, value: plan.toObject() as unknown as DailyPlanType };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async savePlan(userId: string, date: string, plan: DailyPlanType): Promise<DBResult<null>> {
    try {
      await DailyPlan.findOneAndUpdate(
        { userId, date },
        { ...plan, updatedAt: new Date() },
        { upsert: true }
      );
      return { ok: true };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async deletePlan(userId: string, date: string): Promise<DBResult<null>> {
    try {
      await DailyPlan.deleteOne({ userId, date });
      return { ok: true };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async listUserPlans(userId: string): Promise<DBResult<string[]>> {
    try {
      const plans = await DailyPlan.find({ userId }).select('date');
      return { ok: true, value: plans.map(plan => plan.date) };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}

export class FeedbackRepository {
  async getFeedback(userId: string, taskId: string): Promise<DBResult<FeedbackType>> {
    try {
      const feedback = await Feedback.findOne({ userId, taskId });
      if (!feedback) {
        return { ok: false, error: 'Feedback not found' };
      }
  return { ok: true, value: feedback.toObject() as unknown as FeedbackType };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async saveFeedback(userId: string, taskId: string, feedback: FeedbackType): Promise<DBResult<null>> {
    try {
      await Feedback.findOneAndUpdate(
        { userId, taskId },
        feedback,
        { upsert: true }
      );
      return { ok: true };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async listUserFeedback(userId: string): Promise<DBResult<string[]>> {
    try {
      const feedbacks = await Feedback.find({ userId }).select('taskId');
      return { ok: true, value: feedbacks.map(f => f.taskId) };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async getAllUserFeedback(userId: string): Promise<DBResult<FeedbackType[]>> {
    try {
      const feedbacks = await Feedback.find({ userId });
  return { ok: true, value: feedbacks.map(f => f.toObject() as unknown as FeedbackType) };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}

export class ProductivityRepository {
  async getScore(userId: string, date: string): Promise<DBResult<ProductivityScoreType>> {
    try {
      const score = await ProductivityScore.findOne({ userId, date });
      if (!score) {
        return { ok: false, error: 'Score not found' };
      }
  return { ok: true, value: score.toObject() as unknown as ProductivityScoreType };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async saveScore(userId: string, date: string, score: ProductivityScoreType): Promise<DBResult<null>> {
    try {
      await ProductivityScore.findOneAndUpdate(
        { userId, date },
        score,
        { upsert: true }
      );
      return { ok: true };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async listUserScores(userId: string): Promise<DBResult<string[]>> {
    try {
      const scores = await ProductivityScore.find({ userId }).select('date');
      return { ok: true, value: scores.map(s => s.date) };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}

export class ActivityRepository {
  private getActivityKey(userId: string, date: string): string {
    return `user:${userId}:activity:${date}`;
  }

  async getActivity(userId: string, date: string): Promise<DBResult<ActivityPatternType>> {
    try {
      // we store activity patterns with a startDate field per schema
      const activity = await ActivityPattern.findOne({ userId, startDate: date });
      if (!activity) return { ok: false, error: 'Activity not found' };
  return { ok: true, value: activity.toObject() as unknown as ActivityPatternType };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async saveActivity(userId: string, date: string, activity: ActivityPatternType): Promise<DBResult<null>> {
    try {
      await ActivityPattern.findOneAndUpdate(
        { userId, startDate: date },
        { ...activity, startDate: date, updatedAt: new Date() },
        { upsert: true }
      );
      return { ok: true };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async listUserActivities(userId: string): Promise<DBResult<string[]>> {
    try {
      const activities = await ActivityPattern.find({ userId }).select('startDate');
  return { ok: true, value: activities.map(a => a.startDate).filter((d): d is string => Boolean(d)) };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}

export class SettingsRepository {
  private getSettingsKey(userId: string): string {
    return `user:${userId}:settings`;
  }

  async getSettings(userId: string): Promise<DBResult<UserSettingsType>> {
    try {
      const settings = await UserSettings.findOne({ userId });
      if (!settings) return { ok: false, error: 'Settings not found' };
  return { ok: true, value: settings.toObject() as unknown as UserSettingsType };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async saveSettings(userId: string, settings: UserSettingsType): Promise<DBResult<null>> {
    try {
      await UserSettings.findOneAndUpdate(
        { userId },
        { ...settings, userId, updatedAt: new Date() },
        { upsert: true }
      );
      return { ok: true };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}

export const userRepo = new UserRepository();
export const planRepo = new PlanRepository();
export const feedbackRepo = new FeedbackRepository();
export const productivityRepo = new ProductivityRepository();
export const activityRepo = new ActivityRepository();
export const settingsRepo = new SettingsRepository();
