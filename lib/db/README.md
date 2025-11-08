# Database Layer Documentation

## Overview
FlowMate uses MongoDB with a repository pattern for type-safe data access. The database layer provides a key-value store interface that maintains compatibility with the previous Replit DB implementation.

## Architecture

### Client (`lib/db/client.ts`)
- Singleton pattern for database connection
- Safe wrapper functions with consistent error handling:
  - `safeGet<T>(key)` - Get a value by key
  - `safeSet<T>(key, value)` - Set a value
  - `safeDelete(key)` - Delete a key
  - `safeList(prefix)` - List keys with prefix

### Repositories (`lib/db/repository.ts`)
Type-safe repositories for each data entity:

#### UserRepository
- `getProfile(userId)` - Get user profile
- `saveProfile(userId, profile)` - Save/update profile
- `deleteProfile(userId)` - Delete profile

#### PlanRepository
- `getPlan(userId, date)` - Get daily plan
- `savePlan(userId, date, plan)` - Save/update plan
- `deletePlan(userId, date)` - Delete plan
- `listUserPlans(userId)` - List all plan dates

#### FeedbackRepository
- `getFeedback(userId, taskId)` - Get task feedback
- `saveFeedback(userId, taskId, feedback)` - Save feedback
- `listUserFeedback(userId)` - List feedback keys
- `getAllUserFeedback(userId)` - Get all feedback objects

#### ProductivityRepository
- `getScore(userId, date)` - Get productivity score
- `saveScore(userId, date, score)` - Save score
- `listUserScores(userId)` - List score dates

#### ActivityRepository
- `getActivity(userId, date)` - Get activity pattern
- `saveActivity(userId, date, activity)` - Save activity
- `listUserActivities(userId)` - List activity dates

#### SettingsRepository
- `getSettings(userId)` - Get user settings
- `saveSettings(userId, settings)` - Save settings

## Key Naming Convention

All keys follow the pattern: `user:{userId}:{type}:{identifier}`

Examples:
- `user:123:profile`
- `user:123:plan:2025-11-08`
- `user:123:feedback:task-456`
- `user:123:score:2025-11-08`
- `user:123:activity:2025-11-08`
- `user:123:settings`

## Error Handling

All repository methods return `DBResult<T>`:
```typescript
{
  ok: boolean;
  value?: T;        // Present when ok is true
  error?: string;   // Present when ok is false
}
```

Error types:
- `"Key not found"` - Requested key doesn't exist (404)
- Other errors - Database operation failed (500)

## Usage in API Routes

```typescript
import { userRepo } from '@/lib/db/repository';
import { getUserId, unauthorized, notFound, serverError, success } from '@/lib/api-utils';

export async function GET() {
  const userId = await getUserId();
  if (!userId) return unauthorized();

  const result = await userRepo.getProfile(userId);
  
  if (!result.ok) {
    if (result.error === 'Key not found') {
      return notFound('Profile not found');
    }
    return serverError('Database error');
  }

  return success(result.value);
}
```

## Testing

For Phase 2 development, you can test the database layer using mock data:

```typescript
import { userRepo } from '@/lib/db/repository';
import { mockUserProfile } from '@/lib/mock-data';

// Save mock profile
await userRepo.saveProfile('test-user', mockUserProfile);

// Retrieve it
const result = await userRepo.getProfile('test-user');
console.log(result.value);
```

## Phase 3+ Integration

When building UI components in Phase 3:
1. Use these repositories in your API routes
2. Never expose database operations to the client
3. All database access must go through authenticated API routes
4. Use Zustand stores on the client to cache API responses

## Environment Variables

Configure MongoDB connection using environment variables:

```bash
MONGODB_URI=mongodb://localhost:27017          # MongoDB connection string
MONGODB_DB_NAME=flowmate                       # Database name (default: flowmate)
MONGODB_COLLECTION_NAME=keyvalue               # Collection name (default: keyvalue)
```

For MongoDB Atlas or other cloud providers:
```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
```

## Migration Notes

- Migrated from Replit DB to MongoDB
- Uses a key-value collection pattern for backward compatibility
- Connection is cached globally for Next.js serverless compatibility
- No schema migrations needed (schemaless)
- Data is automatically persisted
- Works with local MongoDB or MongoDB Atlas
