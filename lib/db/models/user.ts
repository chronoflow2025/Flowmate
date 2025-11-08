import { Schema, Model, Document } from 'mongoose';
import { connectMongoose } from '@/lib/db/mongoose';
import mongoose from 'mongoose';

// Shared shape for the user record stored in MongoDB
export interface IUserDocument extends Document {
  userId: string; // Clerk user id - unique
  name?: string | null;
  email?: string | null;
  routine?: Record<string, unknown> | string;
  meta?: Record<string, unknown>; // open for future fields
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUserDocument>({
  userId: { type: String, required: true, unique: true, index: true },
  name: { type: String },
  email: { type: String },
  routine: { type: Schema.Types.Mixed },
  meta: { type: Schema.Types.Mixed },
}, { timestamps: true, minimize: false });

// Ensure we reuse existing model when hot-reloading in dev
export async function getUserModel(): Promise<Model<IUserDocument>> {
  await connectMongoose();

  try {
    return mongoose.model<IUserDocument>('User');
  } catch (e) {
    return mongoose.model<IUserDocument>('User', UserSchema);
  }
}

// Helper: create or update user record using Clerk-provided data
export async function createOrUpdateUserFromClerk(userId: string, data: { name?: string | null; email?: string | null; routine?: any; meta?: Record<string, unknown> }) {
  const User = await getUserModel();
  const update: Partial<IUserDocument> = {
    name: data.name ?? null,
    email: data.email ?? null,
    routine: data.routine ?? undefined,
    meta: data.meta ?? undefined,
  };

  const doc = await User.findOneAndUpdate(
    { userId },
    { $set: update },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  ).lean();

  return doc as unknown as IUserDocument;
}

export async function getUserByUserId(userId: string) {
  const User = await getUserModel();
  const doc = await User.findOne({ userId }).lean();
  return doc as unknown as IUserDocument | null;
}
