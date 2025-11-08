import Client from '@replit/database';

class ReplitDBClient {
  private static instance: Client;
  
  private constructor() {}
  
  static getInstance(): Client {
    if (!ReplitDBClient.instance) {
      ReplitDBClient.instance = new Client();
    }
    return ReplitDBClient.instance;
  }
}

export const db = ReplitDBClient.getInstance();

export type DBResult<T> = {
  ok: boolean;
  value?: T;
  error?: string;
};

export async function safeGet<T>(key: string): Promise<DBResult<T>> {
  try {
    const result = await db.get(key);
    if (result === null || result === undefined) {
      return { ok: false, error: 'Key not found' };
    }
    return { ok: true, value: result as T };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function safeSet<T>(key: string, value: T): Promise<DBResult<null>> {
  try {
    await db.set(key, value);
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function safeDelete(key: string): Promise<DBResult<null>> {
  try {
    await db.delete(key);
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function safeList(prefix: string = ''): Promise<DBResult<string[]>> {
  try {
    const result = await db.list(prefix);
    
    if (result && 'ok' in result && result.ok) {
      return { ok: true, value: result.value as string[] };
    } else if (Array.isArray(result)) {
      return { ok: true, value: result };
    } else {
      return { ok: false, error: 'Failed to list keys' };
    }
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
