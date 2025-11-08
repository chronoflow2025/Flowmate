# FlowMate - Development Phases

## ⚠️ IMPORTANT: Read Before Starting
This project is designed to be built in **5 independent phases** that can be worked on by different team members. Before starting any work:

1. Read this entire document
2. Check `.phase-status.json` to see what's in progress
3. Read `DEVELOPMENT.md` for workflow instructions
4. Claim your phase before starting work

---

## Phase Overview

| Phase | Estimated Time | Dependencies | Status |
|-------|---------------|--------------|--------|
| Phase 1: Foundation & DevOps | 1.5-2 days | None | ✅ Completed |
| Phase 2: Authentication & Data Layer | 2-2.5 days | Phase 1 | ✅ Completed |
| Phase 3: Core UI Components | 3-3.5 days | Phases 1, 2 | ✅ Completed |
| Phase 4: AI Integration & Feedback | 2-3 days | Phases 1, 2, 3 | ✅ Completed |
| Phase 5: Analytics & Polish | 2 days | Phases 2, 3, 4 | ✅ Completed |

**Total Estimated Time:** 10.5-13 days

---

## Phase 1: Foundation & DevOps
**Goal:** Set up a stable, reproducible development environment that all other phases can build upon.

### Tasks
- [ ] **1.1 Next.js 15 Setup**
  - Initialize Next.js 15 with TypeScript
  - Configure App Router structure
  - Set up ESLint and Prettier
  - Time: 2-3 hours

- [ ] **1.2 Tailwind & Shadcn Configuration**
  - Install and configure Tailwind CSS
  - Set up shadcn/ui component library
  - Create base theme tokens (colors, spacing, typography)
  - Set up CSS variables for theming
  - Time: 2-3 hours

- [ ] **1.3 Project Structure**
  - Create folder structure (`/app`, `/components`, `/lib`, `/types`, `/stores`)
  - Set up path aliases in tsconfig.json
  - Create base layout component with navigation shell
  - Time: 1-2 hours

- [ ] **1.4 Replit Configuration**
  - Configure dev server to run on `0.0.0.0:5000`
  - Set up workflow configuration
  - Configure Next.js to allow all hosts (proxy requirement)
  - Create `.env.example` file
  - Time: 1 hour

- [ ] **1.5 State Management Setup**
  - Install and configure Zustand
  - Create base store structure (auth, user, plan, feedback)
  - Set up store scaffolds with TypeScript types
  - Time: 2 hours

- [ ] **1.6 Mock Data Utilities**
  - Create mock data generators for development
  - Set up sample user profiles, tasks, feedback
  - Time: 1-2 hours

### Deliverables
✅ Working Next.js app on port 5000  
✅ CI lint/test scripts passing  
✅ Base layout with navigation shell  
✅ Documented run instructions in README  
✅ Theme tokens configured  
✅ Store scaffolds ready  

### Acceptance Criteria
- `npm run dev` starts server on `0.0.0.0:5000`
- No TypeScript errors in project
- Base layout renders with theme applied
- All team members can clone and run locally

### Handoff Notes
**Provides to other phases:**
- Shared TypeScript types in `/types/shared.ts`
- Theme configuration in `tailwind.config.ts`
- Base components in `/components/ui`
- Store structure in `/stores`

---

## Phase 2: Authentication & Data Layer
**Goal:** Implement secure authentication and data persistence layer.

### Tasks
- [ ] **2.1 Clerk Integration**
  - Set up Clerk account and get API keys
  - Install `@clerk/nextjs`
  - Configure Clerk provider and middleware
  - Implement Google OAuth
  - Implement Guest mode
  - Time: 3-4 hours

- [ ] **2.2 Route Guards**
  - Create protected route middleware
  - Set up redirect logic (new users → onboarding, returning → dashboard)
  - Implement session management
  - Time: 2 hours

- [ ] **2.3 Replit DB Integration**
  - Create database client wrapper
  - Set up typed repository pattern
  - Implement CRUD utilities for:
    - User profiles
    - Daily plans
    - Feedback records
    - Activity patterns
    - Productivity scores
  - Time: 4-5 hours

- [ ] **2.4 Database Schema Implementation**
  - Implement schema as documented in spec:
    - `user:{userId}:profile`
    - `user:{userId}:plan:{date}`
    - `user:{userId}:feedback:{taskId}`
    - `user:{userId}:score:{date}`
    - `user:{userId}:activity:{date}`
  - Create migration/seed scripts
  - Time: 3-4 hours

- [ ] **2.5 API Route Scaffolds**
  - Create API route structure
  - Set up error handling middleware
  - Implement stubs for:
    - `/api/user/profile` (GET, PUT)
    - `/api/user/onboarding` (POST)
    - `/api/plan/generate` (POST)
    - `/api/feedback` (POST)
  - Time: 2-3 hours

### Deliverables
✅ End-to-end sign-in/sign-out flow  
✅ Guest session support  
✅ Secured API routes  
✅ CRUD utilities with type safety  
✅ Seed data for testing  

### Acceptance Criteria
- Users can sign in with Google
- Guest users get anonymous sessions
- Protected routes redirect correctly
- All database operations are typed
- Seed script populates sample data

### Handoff Notes
**Depends on Phase 1:**
- Base layout structure
- TypeScript types
- Store scaffolds

**Provides to other phases:**
- Auth context via Clerk
- Database utilities in `/lib/db`
- API route patterns
- Type definitions in `/types/database.ts`

---

## Phase 3: Core UI Components
**Goal:** Build the main user interface for task management and scheduling.

### Tasks
- [ ] **3.1 Onboarding Wizard**
  - Create multi-step form component
  - Implement 5 onboarding steps:
    1. Occupation/industry
    2. Daily routine (wake/sleep times)
    3. Habits selection
    4. Focus scale (1-10)
    5. Peak activity hours
  - Add form validation
  - Connect to `/api/user/onboarding`
  - Time: 4-5 hours

- [ ] **3.2 Calendar Component (Left Panel)**
  - Integrate React Big Calendar
  - Configure as date picker only (no events)
  - Add daily productivity badges with color coding:
    - 🟢 90-100% (Excellent)
    - 🟡 70-89% (Good)
    - 🟠 50-69% (Average)
    - 🔴 <50% (Needs work)
  - Time: 3-4 hours

- [ ] **3.3 Timeline Component (Right Panel)**
  - Create hourly grid (3 AM → 3 AM next day)
  - Implement task blocks with priority colors (1.0-5.0)
  - Add color gradient system
  - Implement editing rules:
    - ✅ Upcoming events: Full edit
    - 🔒 Ended events: Read-only, greyed out
  - Time: 6-7 hours

- [ ] **3.4 Task Editing**
  - Create task edit dialog
  - Allow time, priority, title, duration changes
  - Add delete confirmation
  - Implement drag-and-drop (optional)
  - Time: 3-4 hours

- [ ] **3.5 Focus Mode Layout**
  - Create main dashboard layout
  - Implement 30/70 split (calendar/timeline)
  - Add responsive breakpoints
  - Style top navigation bar
  - Time: 2-3 hours

- [ ] **3.6 State Integration**
  - Connect components to Zustand stores
  - Implement optimistic updates
  - Add loading states
  - Handle error states
  - Time: 3-4 hours

### Deliverables
✅ Complete onboarding flow  
✅ Interactive calendar with badges  
✅ Timeline with editable tasks  
✅ Responsive layout  
✅ State persistence  

### Acceptance Criteria
- User can complete onboarding
- Calendar shows productivity badges
- Timeline displays tasks correctly
- User can edit upcoming tasks
- Past tasks are locked
- All changes persist to database

### Handoff Notes
**Depends on:**
- Phase 1: Layout, theme, components
- Phase 2: Auth context, database utilities

**Provides to other phases:**
- Calendar component for reuse
- Timeline component for AI updates
- Task editing patterns

---

## Phase 4: AI Integration & Feedback Loop
**Goal:** Implement AI-powered plan generation and feedback collection.

### Tasks
- [ ] **4.1 Google Gemini Setup**
  - Get Gemini API key
  - Install Gemini SDK
  - Create AI client wrapper
  - Set up rate limiting
  - Time: 2 hours

- [ ] **4.2 Plan Generation**
  - Implement `/api/plan/generate` endpoint
  - Create prompt templates for:
    - User profile context
    - Historical feedback
    - Calendar events
    - Tomorrow's plan generation
  - Parse AI response into structured tasks
  - Time: 4-5 hours

- [ ] **4.3 AI Chat Interface**
  - Create chat UI component
  - Implement `/api/chat` with streaming
  - Add command parser for:
    - "Generate tomorrow's plan"
    - "Move task to [time]"
    - "Add [task] at [time]"
    - "Delete [task]"
  - Display streaming responses
  - Time: 5-6 hours

- [ ] **4.4 Feedback Toast System**
  - Create FeedbackToast component
  - Trigger 2 minutes before task ends
  - Collect:
    - Focus Rating (1-10 slider)
    - Completion % (dropdown)
    - Text feedback (optional)
  - Store to database
  - Time: 4-5 hours

- [ ] **4.5 Pattern Analysis**
  - Implement feedback aggregation
  - Calculate daily productivity scores
  - Identify hourly activity patterns
  - Generate insights for AI
  - Time: 3-4 hours

### Deliverables
✅ Working plan generation  
✅ AI chat with streaming  
✅ Feedback collection system  
✅ Pattern analysis pipeline  

### Acceptance Criteria
- AI generates sensible tomorrow's plans
- Chat commands work correctly
- Feedback toast appears on schedule
- All feedback is stored with timestamps
- Productivity scores update daily

### Handoff Notes
**Depends on:**
- Phase 1: Store structure
- Phase 2: Database, API patterns
- Phase 3: Timeline component

**Provides to other phases:**
- AI utilities in `/lib/ai`
- Feedback data for analytics
- Pattern analysis functions

---

## Phase 5: Analytics, Settings & Polish
**Goal:** Add analytics dashboard, settings, and final polish for production.

### Tasks
- [ ] **5.1 Analytics Dashboard**
  - Install and configure Recharts
  - Implement charts:
    - 30-Day Productivity Trend (Line)
    - Weekly Heatmap (Calendar)
    - Time-of-Day Activity (Area)
    - Focus vs Completion (Scatter)
    - Completion Rate Trends (Bar)
    - Focus-Completion Matrix (Quadrant)
  - Add chart tooltips and legends
  - Time: 6-7 hours

- [ ] **5.2 Profile & Settings Pages**
  - Create profile edit page
  - Implement settings sections:
    - Account (name, email)
    - Privacy (data export, clear history)
    - Notifications (toggles, timing)
    - Appearance (dark mode, time format, colors)
  - Connect to database
  - Time: 4-5 hours

- [ ] **5.3 Accessibility**
  - Add ARIA labels
  - Implement keyboard navigation
  - Test screen reader support
  - Add color-blind friendly palettes
  - Ensure contrast ratios
  - Time: 3-4 hours

- [ ] **5.4 Performance Optimization**
  - Optimize bundle size
  - Add loading skeletons
  - Implement code splitting
  - Optimize images
  - Add caching headers
  - Time: 2-3 hours

- [ ] **5.5 Documentation & Deployment**
  - Update README with setup instructions
  - Document environment variables
  - Configure deployment settings for Replit
  - Test production build
  - Time: 2 hours

### Deliverables
✅ Complete analytics dashboard  
✅ Profile and settings management  
✅ Accessibility compliance  
✅ Production-ready build  
✅ Complete documentation  

### Acceptance Criteria
- All charts display correctly
- Settings persist across sessions
- Keyboard navigation works
- Page load time < 3 seconds
- Production deployment successful

### Handoff Notes
**Depends on:**
- Phase 2: Database for settings
- Phase 3: UI patterns
- Phase 4: Feedback data

**Final deliverable:**
- Production-ready FlowMate MVP

---

## Cross-Phase Coordination

### Shared Contracts
All phases must follow these shared contracts (defined in Phase 1):

**TypeScript Types** (`/types/shared.ts`):
```typescript
interface UserProfile {
  userId: string;
  occupation: string;
  focusScale: number;
  peakHours: string[];
  habits: string[];
  routine: string;
  colorGradient: { low: string; high: string };
}

interface Task {
  id: string;
  time: string;
  duration: number;
  title: string;
  priority: number;
  completed: boolean;
}

interface Feedback {
  taskId: string;
  focusRating: number;
  completionPercent: number;
  textFeedback?: string;
  timestamp: string;
}
```

### API Contracts
All API routes must follow REST conventions:
- Use proper HTTP methods (GET, POST, PUT, DELETE)
- Return consistent error format: `{ error: string, code: number }`
- Use proper status codes
- Include TypeScript types for request/response

### Feature Flags
Use environment variables for toggling features:
- `NEXT_PUBLIC_ENABLE_AI=true/false` - Enable/disable AI features
- `NEXT_PUBLIC_MOCK_DATA=true/false` - Use mock data instead of API

---

## Conflict Prevention

### File Ownership
To prevent merge conflicts, each phase has designated file ownership:

**Phase 1 owns:**
- `/app/layout.tsx`
- `/components/ui/*`
- `/lib/utils.ts`
- `/types/shared.ts`
- Configuration files

**Phase 2 owns:**
- `/app/api/auth/*`
- `/lib/db/*`
- `/types/database.ts`
- `/middleware.ts`

**Phase 3 owns:**
- `/app/(dashboard)/*`
- `/components/calendar/*`
- `/components/timeline/*`
- `/components/onboarding/*`

**Phase 4 owns:**
- `/app/api/plan/*`
- `/app/api/chat/*`
- `/app/api/feedback/*`
- `/lib/ai/*`
- `/components/chat/*`

**Phase 5 owns:**
- `/app/analytics/*`
- `/app/settings/*`
- `/components/charts/*`

### Branch Strategy
- Each phase gets its own branch: `phase-1`, `phase-2`, etc.
- Merge to `main` only when phase is complete and tested
- Create PR with checklist from acceptance criteria

### Communication
- Update `.phase-status.json` when starting/completing work
- Leave TODO comments with your name for incomplete work
- Document any deviations from spec in commit messages

---

## Testing Requirements

Each phase must include:
1. **Unit tests** for utility functions
2. **Integration tests** for API routes
3. **Component tests** for UI elements
4. **Manual testing checklist** in PR description

---

## Questions?

If you're unsure about anything:
1. Check `DEVELOPMENT.md` for workflow
2. Check `replit.md` for architectural decisions
3. Ask in team chat before making assumptions
4. Document your decision if you must proceed

---

**Last Updated:** November 8, 2025  
**Document Owner:** Project Lead
