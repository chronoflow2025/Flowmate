import mongoose from 'mongoose';

class MongoDBClient {
  private static instance: typeof mongoose;
  
  private constructor() {}
  
  static async getInstance(): Promise<typeof mongoose> {
    if (!MongoDBClient.instance) {
      const uri = process.env.MONGODB_URI;
      if (!uri) {
        throw new Error('MongoDB URI is not defined in environment variables');
      }
      
      try {
        await mongoose.connect(uri);
        MongoDBClient.instance = mongoose;
      } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
      }
    }
    return MongoDBClient.instance;
  }

  static async disconnect(): Promise<void> {
    if (MongoDBClient.instance) {
      await mongoose.disconnect();
    }
  }
}

export const getMongoClient = MongoDBClient.getInstance;

export type DBResult<T> = {
  ok: boolean;
  value?: T;
  error?: string;
};

// Define mongoose schemas
const userProfileSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  name: String,
  email: String,
  occupation: String,
  habits: [String],
  peakHours: [String],
  focusAreas: [String],
  routine: Object,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const dailyPlanSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  date: { type: String, required: true },
  tasks: [{
    id: String,
    title: String,
    startTime: String,
    endTime: String,
    completed: Boolean,
    category: String
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const feedbackSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  taskId: { type: String, required: true },
  rating: Number,
  comment: String,
  timestamp: { type: Date, default: Date.now }
});

const productivityScoreSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  date: { type: String, required: true },
  score: Number,
  metrics: Object,
  createdAt: { type: Date, default: Date.now }
});

const activityPatternSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  pattern: Object,
  startDate: String,
  endDate: String,
  createdAt: { type: Date, default: Date.now }
});

const userSettingsSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  preferences: Object,
  notifications: Object,
  theme: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Export models
export const UserProfile = mongoose.model('UserProfile', userProfileSchema);
export const DailyPlan = mongoose.model('DailyPlan', dailyPlanSchema);
export const Feedback = mongoose.model('Feedback', feedbackSchema);
export const ProductivityScore = mongoose.model('ProductivityScore', productivityScoreSchema);
export const ActivityPattern = mongoose.model('ActivityPattern', activityPatternSchema);
export const UserSettings = mongoose.model('UserSettings', userSettingsSchema);

export async function safeList(prefix: string = ''): Promise<DBResult<string[]>> {
  try {
    const mongooseClient = await getMongoClient();
    const db = mongooseClient.connection?.db;
    if (!db) {
      return { ok: false, error: 'No database connection available' };
    }

    const collections = await db.listCollections().toArray();
    const result = collections.map((col: { name: string }) => col.name).filter((name: string) => name.startsWith(prefix));
    
    if (Array.isArray(result)) {
      return { ok: true, value: result };
    } else {
      return { ok: false, error: 'Failed to list keys' };
    }
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
