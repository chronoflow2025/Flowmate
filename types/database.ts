/**
 * DATABASE TYPE DEFINITIONS
 * 
 * These types represent the structure of data in Replit DB.
 * Phase 2 owns this file.
 * 
 * Last updated: November 8, 2025
 */

import { UserProfile, DailyPlan, Feedback, ProductivityScore, ActivityPattern, UserSettings } from './shared';

export type DBKey = 
  | `user:${string}:profile`
  | `user:${string}:plan:${string}`
  | `user:${string}:feedback:${string}`
  | `user:${string}:score:${string}`
  | `user:${string}:activity:${string}`
  | `user:${string}:settings`;

export interface DBOperations {
  get<T>(key: DBKey): Promise<T | null>;
  set<T>(key: DBKey, value: T): Promise<void>;
  delete(key: DBKey): Promise<void>;
  list(prefix: string): Promise<DBKey[]>;
}

export type ProfileKey = `user:${string}:profile`;
export type PlanKey = `user:${string}:plan:${string}`;
export type FeedbackKey = `user:${string}:feedback:${string}`;
export type ScoreKey = `user:${string}:score:${string}`;
export type ActivityKey = `user:${string}:activity:${string}`;
export type SettingsKey = `user:${string}:settings`;

export interface Repository<T> {
  get(key: string): Promise<T | null>;
  set(key: string, value: T): Promise<void>;
  delete(key: string): Promise<void>;
  list(prefix: string): Promise<T[]>;
}

export type ProfileRepository = Repository<UserProfile>;
export type PlanRepository = Repository<DailyPlan>;
export type FeedbackRepository = Repository<Feedback>;
export type ScoreRepository = Repository<ProductivityScore>;
export type ActivityRepository = Repository<ActivityPattern>;
export type SettingsRepository = Repository<UserSettings>;
