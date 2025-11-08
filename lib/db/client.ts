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
  if (globalForMongo.mongoClient && globalForMongo.mongoDb && globalForMongo.mongoCollection) {
    try {
      await globalForMongo.mongoDb.admin().ping();
      return;
    } catch {
      globalForMongo.mongoClient = undefined;
      globalForMongo.mongoDb = undefined;
      globalForMongo.mongoCollection = undefined;
    }
  }

  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB_NAME;
  const collectionName = process.env.MONGODB_COLLECTION_NAME;

  // Check if URI uses mongodb+srv (Atlas) which requires TLS
  const isAtlas = uri.startsWith('mongodb+srv://');
  
  if (!globalForMongo.mongoClient) {
    const clientOptions: {
      maxPoolSize: number;
      serverSelectionTimeoutMS: number;
      socketTimeoutMS: number;
      tls?: boolean;
      tlsAllowInvalidCertificates?: boolean;
    } = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000, // Increased for Atlas
      socketTimeoutMS: 45000,
    };

    // For Atlas (mongodb+srv), TLS is required and handled automatically
    // For regular mongodb:// connections, only enable TLS if explicitly needed
    if (isAtlas) {
      // Atlas automatically uses TLS with mongodb+srv
      // No additional TLS config needed
    } else if (uri.includes('ssl=true') || uri.includes('tls=true')) {
      // If URI explicitly requests SSL/TLS
      clientOptions.tls = true;
    }

    globalForMongo.mongoClient = new MongoClient(uri, clientOptions);
  }

  try {
    await globalForMongo.mongoClient.connect();
    globalForMongo.mongoDb = globalForMongo.mongoClient.db(dbName);
    globalForMongo.mongoCollection = globalForMongo.mongoDb.collection<KeyValueDocument>(collectionName);

    // MongoDB automatically creates an index on `_id`, so skip manual creation
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('MongoDB connection error:', errorMessage);
    console.error('Connection URI format:', isAtlas ? 'mongodb+srv:// (Atlas)' : 'mongodb:// (Standard)');
    
    // Provide more helpful error messages
    if (errorMessage.includes('SSL') || errorMessage.includes('TLS') || errorMessage.includes('tlsv1')) {
      throw new Error(
        `MongoDB SSL/TLS connection failed. ${isAtlas 
          ? 'Check your MongoDB Atlas connection string and network access settings.' 
          : 'For Atlas, use mongodb+srv:// instead of mongodb://'}`
      );
    }
    
    throw new Error(`Failed to connect to MongoDB: ${errorMessage}`);
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
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    // Log connection errors for debugging
    if (errorMessage.includes('connect') || errorMessage.includes('MongoDB')) {
      console.error('MongoDB connection error in safeGet:', errorMessage);
    }
    return { ok: false, error: errorMessage };
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
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    if (errorMessage.includes('connect') || errorMessage.includes('MongoDB')) {
      console.error('MongoDB connection error in safeSet:', errorMessage);
    }
    return { ok: false, error: errorMessage };
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
