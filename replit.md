# FlowMate - Project Overview & Architecture

## Project Summary
**FlowMate** is an AI-powered productivity assistant that generates personalized daily schedules based on focus patterns, task lists, and calendar events. It learns from user behavior to optimize time allocation and maintain peak productivity.

## Current Status

**Project Phase:** Pre-Development (Documentation Complete)  
**Last Updated:** November 8, 2025  
**Build Approach:** Multi-phase parallel development

### Phase Status Overview
| Phase | Status | Assigned To | Branch | Started | Completed |
|-------|--------|-------------|--------|---------|-----------|
| Phase 1: Foundation | Not Started | - | - | - | - |
| Phase 2: Auth & Data | Not Started | - | - | - | - |
| Phase 3: Core UI | Not Started | - | - | - | - |
| Phase 4: AI Integration | Not Started | - | - | - | - |
| Phase 5: Analytics | Not Started | - | - | - | - |

**Note:** See `.phase-status.json` for real-time status updates.

---

## Tech Stack Decisions

### Frontend
- **Framework:** Next.js 15 with App Router
  - **Why:** Built-in API routes eliminate need for separate backend, server-side rendering, excellent TypeScript support
- **Language:** TypeScript
  - **Why:** Type safety across team reduces bugs, excellent IDE support, mandatory for multi-developer coordination
- **Styling:** Tailwind CSS + shadcn/ui
  - **Why:** Rapid development, consistent design system, accessible components out of the box
- **State Management:** Zustand
  - **Why:** Simpler than Redux, TypeScript-first, no boilerplate, perfect for moderate complexity
- **Calendar:** React Big Calendar
  - **Why:** Mature library, customizable, supports our date picker + badge requirements
- **Charts:** Recharts
  - **Why:** React-native, composable, good documentation, supports all our chart types

### Backend
- **API:** Next.js API Routes
  - **Why:** No separate server needed, deploy as single unit, shared TypeScript types with frontend
- **Database:** Replit DB (Key-Value Store)
  - **Why:** Free, built-in, rollback support, perfect for MVP scope, no SQL complexity needed
- **AI:** Google Gemini API
  - **Why:** 100% free tier (250 requests/day), high quality, structured output support, no rate limits for MVP

### Authentication
- **Provider:** Clerk
  - **Why:** Free tier (10K MAU), Google OAuth + guest mode built-in, excellent Next.js integration, handles session management

### Deployment
- **Platform:** Replit Autoscale
  - **Why:** Free tier, zero config, automatic scaling, rollback support

---

## Architecture Decisions

### 1. Single Codebase (Monorepo)
**Decision:** Frontend + Backend in one Next.js project  
**Rationale:**
- Simpler deployment (one build, one deploy)
- Shared TypeScript types prevent API contract drift
- Faster development for small team
- Replit works best with monorepos

### 2. Key-Value Database
**Decision:** Use Replit DB instead of PostgreSQL  
**Rationale:**
- MVP doesn't need complex queries or joins
- User data is naturally namespaced by userId
- Simpler mental model for team
- Built-in rollback support
- Can migrate to Postgres later if needed

**Trade-off:** Limited query capabilities (no SQL), but acceptable for MVP scope.

### 3. AI-First Plan Generation
**Decision:** AI generates tomorrow's plan only (not today)  
**Rationale:**
- Prevents mid-day disruption
- Users can review/edit before day starts
- Feedback loop is cleaner (full day → feedback → next day plan)
- Reduces AI API calls (once per day vs. continuous)

### 4. Client-Side Optimistic Updates
**Decision:** Use Zustand with optimistic UI updates  
**Rationale:**
- Feels instant to users
- Rollback on error maintains consistency
- Reduces perceived latency
- Better UX than loading spinners

### 5. Phased Development
**Decision:** Build in 5 parallel phases instead of sequential  
**Rationale:**
- Team can work in parallel
- Each phase has clear ownership
- Reduces merge conflicts
- Faster time to MVP completion

---

## Database Schema

### Design Philosophy
- **Namespaced by user:** All keys start with `user:{userId}:`
- **Date-based partitioning:** Plans and feedback keyed by date
- **Denormalized:** Optimize for reads over writes
- **No relations:** Simple key-value lookups

### Schema Structure

```typescript
// User Profile
user:{userId}:profile
{
  userId: string;
  occupation: string;
  focusScale: number;              // 1-10
  peakHours: string[];             // ["9-11 AM", "2-4 PM"]
  habits: string[];                // ["coffee", "walk"]
  routine: string;                 // "Early bird" | "Night owl"
  colorGradient: {
    low: string;                   // Hex color for low priority
    high: string;                  // Hex color for high priority
  };
  createdAt: string;
  updatedAt: string;
}

// Daily Plan
user:{userId}:plan:{date}         // date format: YYYY-MM-DD
{
  date: string;
  tasks: [
    {
      id: string;                  // task-{timestamp}-{random}
      time: string;                // HH:mm format
      duration: number;            // Minutes
      title: string;
      priority: number;            // 1.0 to 5.0 (0.5 increments)
      completed: boolean;
      source: "ai" | "user" | "calendar";
    }
  ];
  generatedAt: string;
  lastModified: string;
}

// Task Feedback
user:{userId}:feedback:{taskId}
{
  taskId: string;
  focusRating: number;             // 1-10
  completionPercent: number;       // 0, 25, 50, 75, 100
  textFeedback?: string;
  timestamp: string;
  taskDate: string;                // For querying by date
}

// Daily Productivity Score (cached)
user:{userId}:score:{date}
{
  date: string;
  score: number;                   // 0-100
  totalTasks: number;
  completedTasks: number;
  avgFocus: number;                // Average focus rating
  avgCompletion: number;           // Average completion %
  calculatedAt: string;
}

// Hourly Activity Pattern (aggregated)
user:{userId}:activity:{date}
{
  date: string;
  hourly: {
    "09:00": {
      focus: number;               // Avg focus for this hour
      activity: string;            // Task title
      completion: number;
    },
    // ... for each hour with data
  };
}

// User Settings
user:{userId}:settings
{
  notifications: {
    email: boolean;
    push: boolean;
    feedbackTiming: number;        // Minutes before task end
  };
  appearance: {
    darkMode: boolean;
    timeFormat: "12h" | "24h";
    colorPreset: string;
  };
  privacy: {
    dataCollection: boolean;
  };
}
```

### Migration Strategy
If we outgrow key-value store:
1. Export all data to JSON
2. Set up Postgres with proper schema
3. Import with transformation script
4. Update `/lib/db` adapter layer
5. Frontend/API code unchanged (abstraction layer handles it)

---

## State Management Strategy

### Zustand Stores

```typescript
// /stores/auth.ts
interface AuthStore {
  user: User | null;
  isGuest: boolean;
  isLoaded: boolean;
}

// /stores/user.ts
interface UserStore {
  profile: UserProfile | null;
  settings: UserSettings | null;
  fetchProfile: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

// /stores/plan.ts
interface PlanStore {
  currentDate: string;
  tasks: Task[];
  loading: boolean;
  fetchPlan: (date: string) => Promise<void>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  optimisticUpdate: (taskId: string, updates: Partial<Task>) => void;
}

// /stores/feedback.ts
interface FeedbackStore {
  pendingFeedback: Map<string, Feedback>;
  submitFeedback: (taskId: string, feedback: Feedback) => Promise<void>;
}
```

### Data Flow

```
User Action → Zustand Action → Optimistic UI Update → API Call → Success/Rollback
```

Example:
```typescript
// User edits task
const updateTask = async (taskId, updates) => {
  // 1. Optimistic update
  set(state => ({
    tasks: state.tasks.map(t => 
      t.id === taskId ? { ...t, ...updates } : t
    )
  }));

  try {
    // 2. API call
    await fetch(`/api/plan/task/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  } catch (error) {
    // 3. Rollback on error
    get().fetchPlan(currentDate);  // Reload from server
    toast.error("Failed to update task");
  }
};
```

---

## API Design

### REST Conventions
- **GET:** Read data
- **POST:** Create new resources
- **PUT:** Update existing resources
- **DELETE:** Remove resources

### Error Handling
All API routes return consistent error format:

```typescript
// Success
{ data: T }

// Error
{ 
  error: string,           // Human-readable message
  code: string,            // Machine-readable code
  details?: any            // Optional debug info
}
```

### Authentication
All API routes (except auth endpoints) require valid Clerk session:

```typescript
import { auth } from '@clerk/nextjs';

export async function GET(request: Request) {
  const { userId } = auth();
  if (!userId) {
    return Response.json(
      { error: "Unauthorized", code: "AUTH_REQUIRED" },
      { status: 401 }
    );
  }
  // ... proceed
}
```

---

## AI Integration Strategy

### Prompt Engineering

**Plan Generation Prompt Structure:**
```
CONTEXT:
- User profile: {occupation, routine, habits, peakHours, focusScale}
- Historical feedback: Last 7 days average focus, completion rates
- Calendar events: {tomorrow's Google Calendar events}
- Past patterns: {hourly activity data}

TASK:
Generate a detailed daily schedule for {tomorrow's date} that:
1. Maximizes productive hours during peak times
2. Includes breaks based on past focus patterns
3. Respects calendar commitments
4. Balances task difficulty with energy levels

OUTPUT FORMAT:
{
  "tasks": [
    {
      "time": "09:00",
      "duration": 120,
      "title": "Deep Work: Project X",
      "priority": 4.5,
      "reasoning": "High focus expected at 9 AM based on past data"
    }
  ],
  "insights": [
    "You're 30% more productive after morning coffee"
  ]
}
```

### Rate Limiting
- Free tier: 250 requests/day
- MVP usage: ~1 request per user per day = 250 users supported
- Implement caching: Store generated plan, only regenerate on explicit request

### Fallback Strategy
```typescript
async function generatePlan(userId: string, date: string) {
  try {
    return await geminiGeneratePlan(userId, date);
  } catch (error) {
    if (error.code === 'RATE_LIMIT') {
      // Fallback to heuristic generation
      return heuristicGeneratePlan(userId, date);
    }
    throw error;
  }
}
```

---

## Performance Considerations

### Bundle Size
- Target: < 200KB initial JS bundle
- Techniques:
  - Dynamic imports for analytics charts
  - Tree-shaking unused shadcn components
  - Lazy load React Big Calendar

### Data Fetching
- Use SWR pattern for caching
- Prefetch tomorrow's plan on dashboard load
- Cache productivity scores (expensive to calculate)

### Optimization Checklist
- [ ] Image optimization (next/image)
- [ ] Font optimization (next/font)
- [ ] Code splitting by route
- [ ] Memoize expensive calculations
- [ ] Debounce user inputs (chat, search)

---

## Security Considerations

### API Keys
- ✅ Store in environment variables
- ✅ Never expose in client code
- ✅ Use Replit Secrets for production
- ❌ Never commit to Git

### User Data
- All data scoped by userId (Clerk)
- No cross-user data leakage
- Database keys enforce namespacing: `user:{userId}:*`

### Input Validation
- Validate all API inputs with Zod schemas
- Sanitize user text before storing
- Rate limit API endpoints (10 req/min per user)

---

## Testing Strategy

### Phase 1: Foundation
- [ ] ESLint passes
- [ ] TypeScript compiles with no errors
- [ ] Dev server starts on port 5000
- [ ] Base layout renders

### Phase 2: Auth & Data
- [ ] User can sign in with Google
- [ ] Guest mode creates anonymous session
- [ ] Database CRUD operations work
- [ ] API routes return proper errors

### Phase 3: Core UI
- [ ] Onboarding flow completes
- [ ] Calendar displays with badges
- [ ] Timeline shows tasks correctly
- [ ] Task editing persists to DB

### Phase 4: AI Integration
- [ ] Plan generation produces valid tasks
- [ ] Chat commands parse correctly
- [ ] Feedback toast appears on schedule
- [ ] AI responses are coherent

### Phase 5: Analytics
- [ ] All charts render with real data
- [ ] Settings persist across sessions
- [ ] Dark mode toggle works
- [ ] Export data functionality works

---

## Deployment Configuration

### Environment Variables (Production)
```bash
# Required
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
GOOGLE_GEMINI_API_KEY=...

# Replit (auto-provided)
REPLIT_DB_URL=...

# Feature Flags (Production)
NEXT_PUBLIC_ENABLE_AI=true
NEXT_PUBLIC_MOCK_DATA=false
```

### Build Configuration
```json
{
  "scripts": {
    "dev": "next dev -p 5000 -H 0.0.0.0",
    "build": "next build",
    "start": "next start -p 5000 -H 0.0.0.0"
  }
}
```

### Replit Deployment Settings
- **Type:** Autoscale (stateless, scales to zero)
- **Port:** 5000 (frontend)
- **Build Command:** `npm run build`
- **Start Command:** `npm start`
- **Health Check:** `GET /api/health`

---

## User Preferences

### Development Workflow
- **Approach:** Phased development with clear ownership
- **Communication:** Document all architectural decisions
- **Code Style:** TypeScript strict mode, ESLint enforced
- **Commits:** Descriptive messages with phase prefix

### Code Conventions
- Use functional components (no class components)
- Prefer server components (use 'use client' only when needed)
- Name files in kebab-case: `user-profile.tsx`
- Export one main component per file
- Co-locate types with components when component-specific

---

## Recent Changes

### November 8, 2025
- ✅ Created comprehensive phase documentation (PHASES.md)
- ✅ Created development workflow guide (DEVELOPMENT.md)
- ✅ Documented architecture decisions (this file)
- 🚧 Next: Create `.phase-status.json` and shared types

---

## Known Limitations & Future Work

### MVP Limitations
1. **Google Calendar sync:** Placeholder only (not implemented in MVP)
2. **Sentiment analysis:** Word cloud requires additional library
3. **Mobile app:** Web-only for MVP
4. **Offline mode:** Requires network connection
5. **Team features:** Single-user only

### Post-MVP Roadmap
1. **v1.1:** Google Calendar integration
2. **v1.2:** Mobile apps (React Native)
3. **v1.3:** Team/shared calendars
4. **v2.0:** Advanced AI features (habit prediction, burnout detection)

---

## Questions & Decisions Log

### Q: Why Replit DB instead of Postgres?
**A:** MVP scope doesn't require complex queries. Key-value store is simpler for team to understand and use. Can migrate later if needed.

### Q: Why only generate tomorrow's plan?
**A:** Prevents mid-day disruption, cleaner feedback loop, reduces API costs.

### Q: Why Clerk instead of NextAuth?
**A:** Better Google OAuth UX, guest mode built-in, free tier more generous.

### Q: Why client-side state instead of React Query?
**A:** Zustand is simpler for team, fewer concepts to learn, good enough for MVP scope.

---

## Contact & Support

**Project Lead:** TBD  
**Tech Lead:** TBD  
**Documentation:** This file + PHASES.md + DEVELOPMENT.md

**For questions:**
1. Check these docs first
2. Ask in team chat
3. Consult Replit Agent
4. Create GitHub issue if needed

---

**Last Updated:** November 8, 2025  
**Next Review:** After Phase 1 completion
