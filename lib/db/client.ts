import { MongoClient, Db, Collection } from 'mongodb';

interface KeyValueDocument {
  _id: string;
  value: unknown;
}

// Global is used here to maintain a cached connection across hot reloads
// in development. This prevents connections growing exponentially
// during API Route usage.
const globalForMongo = globalThis as unknown as {
  mongoClient: MongoClient | undefined;
  mongoDb: Db | undefined;
  mongoCollection: Collection<KeyValueDocument> | undefined;
};

class MongoDBClient {
  private static instance: MongoDBClient;
  
  private constructor() {}
  
  static getInstance(): MongoDBClient {
    if (!MongoDBClient.instance) {
      MongoDBClient.instance = new MongoDBClient();
    }
    return MongoDBClient.instance;
  }

  async connect(): Promise<void> {
    // If already initialized, return early
    if (globalForMongo.mongoClient && globalForMongo.mongoDb && globalForMongo.mongoCollection) {
      // Verify connection is still alive by pinging
      try {
        await globalForMongo.mongoDb.admin().ping();
        return;
      } catch {
        // Connection lost, reset and reconnect
        globalForMongo.mongoClient = undefined;
        globalForMongo.mongoDb = undefined;
        globalForMongo.mongoCollection = undefined;
      }
    }

    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
    const dbName = process.env.MONGODB_DB_NAME || 'flowmate';
    const collectionName = process.env.MONGODB_COLLECTION_NAME || 'keyvalue';

    if (!globalForMongo.mongoClient) {
      globalForMongo.mongoClient = new MongoClient(uri, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });
    }

    try {
      // Connect (idempotent - safe to call multiple times)
      await globalForMongo.mongoClient.connect();
      
      globalForMongo.mongoDb = globalForMongo.mongoClient.db(dbName);
      globalForMongo.mongoCollection = globalForMongo.mongoDb.collection<KeyValueDocument>(collectionName);
      
      // Create index on _id for faster lookups (idempotent)
      await globalForMongo.mongoCollection.createIndex({ _id: 1 }, { unique: true });
    } catch (error) {
      throw new Error(`Failed to connect to MongoDB: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async disconnect(): Promise<void> {
    if (globalForMongo.mongoClient) {
      await globalForMongo.mongoClient.close();
      globalForMongo.mongoClient = undefined;
      globalForMongo.mongoDb = undefined;
      globalForMongo.mongoCollection = undefined;
    }
  }

  async getCollection(): Promise<Collection<KeyValueDocument>> {
    if (!globalForMongo.mongoCollection) {
      await this.connect();
    }
    if (!globalForMongo.mongoCollection) {
      throw new Error('MongoDB collection not initialized');
    }
    return globalForMongo.mongoCollection;
  }
}

const mongoClient = MongoDBClient.getInstance();

export const db = mongoClient;

export type DBResult<T> = {
  ok: boolean;
  value?: T;
  error?: string;
};

export async function safeGet<T>(key: string): Promise<DBResult<T>> {
  try {
    const collection = await mongoClient.getCollection();
    const document = await collection.findOne({ _id: key });
    
    if (document === null || document === undefined) {
      return { ok: false, error: 'Key not found' };
    }
    
    return { ok: true, value: document.value as T };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function safeSet<T>(key: string, value: T): Promise<DBResult<null>> {
  try {
    const collection = await mongoClient.getCollection();
    await collection.updateOne(
      { _id: key },
      { $set: { value } },
      { upsert: true }
    );
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function safeDelete(key: string): Promise<DBResult<null>> {
  try {
    const collection = await mongoClient.getCollection();
    const result = await collection.deleteOne({ _id: key });
    
    if (result.deletedCount === 0) {
      return { ok: false, error: 'Key not found' };
    }
    
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function safeList(prefix: string = ''): Promise<DBResult<string[]>> {
  try {
    const collection = await mongoClient.getCollection();
    
    // If prefix is empty, get all keys
    // Otherwise, use regex to match keys starting with prefix
    const query = prefix 
      ? { _id: { $regex: `^${prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}` } }
      : {};
    
    const documents = await collection.find(query, { projection: { _id: 1 } }).toArray();
    const keys = documents.map(doc => doc._id);
    
    return { ok: true, value: keys };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
