# FlowMate - Development Guide

## 🚨 STOP! Read This First

**DO NOT run `npm install` and start building immediately.**

This project uses a **phased development approach** where different team members work on separate phases to avoid conflicts and enable parallel development.

---

## Quick Start for New Team Members

### 1. First Time Setup
```bash
# Clone the repository
git clone <repo-url>
cd flowmate

# Read the documentation (DON'T SKIP THIS!)
cat PHASES.md
cat DEVELOPMENT.md

# Check current phase status
cat .phase-status.json

# Install dependencies (only after reading docs!)
npm install
```

### 2. Choose Your Phase
Before starting work:

1. **Review Available Phases**: Read `PHASES.md` to understand all phases
2. **Check Dependencies**: Ensure prerequisite phases are complete
3. **Claim Your Phase**: Update `.phase-status.json` (see below)
4. **Create Your Branch**: `git checkout -b phase-X-your-name`

### 3. Update Phase Status
Edit `.phase-status.json` to claim your phase:

```json
{
  "phase-1": {
    "status": "in-progress",
    "assignedTo": "your-name",
    "startedAt": "2025-11-08T10:00:00Z",
    "branch": "phase-1-your-name"
  }
}
```

Commit this change immediately so others know you're working on it.

---

## Phase Selection Workflow

```
┌─────────────────────────────────────┐
│  Pull latest from GitHub            │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Read PHASES.md & DEVELOPMENT.md    │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Check .phase-status.json           │
│  - What's available?                │
│  - What are dependencies?           │
└──────────────┬──────────────────────┘
               │
               ▼
         ┌────────────┐
         │ Ask Agent: │
         │ Which phase│
         │ should I   │
         │ work on?   │
         └─────┬──────┘
               │
               ▼
┌─────────────────────────────────────┐
│ Agent analyzes:                     │
│ - Your skills/preference            │
│ - Available phases                  │
│ - Dependencies satisfied?           │
│ - Current blockers                  │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│ Agent recommends phase + explains   │
│ - Why this phase?                   │
│ - What you'll build                 │
│ - How to avoid conflicts            │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│ Update .phase-status.json           │
│ Create branch: phase-X-name         │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│ Start building your phase           │
└─────────────────────────────────────┘
```

---

## Working on Your Phase

### Daily Workflow

```bash
# Start of day
git checkout phase-X-your-name
git pull origin main  # Get latest shared code
npm install           # Update dependencies if needed

# During development
npm run dev          # Test locally on port 5000

# Commit frequently
git add .
git commit -m "phase-X: clear description of changes"

# End of day
git push origin phase-X-your-name
```

### Following Phase Guidelines

Each phase in `PHASES.md` includes:
- ✅ **Tasks**: Specific items to complete
- ✅ **Time estimates**: Plan your work
- ✅ **Deliverables**: What you must complete
- ✅ **Acceptance criteria**: How to verify completion
- ✅ **Handoff notes**: What other phases depend on

**Follow these exactly to avoid conflicts.**

---

## Conflict Prevention Rules

### Rule 1: File Ownership
Only edit files your phase owns (see `PHASES.md` > Conflict Prevention).

**✅ Safe:**
```typescript
// Phase 3 editing their own component
// File: /components/timeline/Timeline.tsx
export function Timeline() { ... }
```

**❌ Dangerous:**
```typescript
// Phase 3 editing Phase 2's file
// File: /lib/db/client.ts  <- This belongs to Phase 2!
export function dbClient() { ... }
```

### Rule 2: Use Shared Contracts
Import types from `/types/shared.ts` instead of creating your own:

**✅ Good:**
```typescript
import { Task, UserProfile } from '@/types/shared';
```

**❌ Bad:**
```typescript
// Creating your own conflicting type
interface Task { ... }  // Already exists in shared!
```

### Rule 3: Use Mock Services
If a phase you depend on isn't done yet, use mocks:

**Example:** Phase 3 needs AI (Phase 4), but Phase 4 isn't ready:

```typescript
// /lib/ai/client.ts
const USE_MOCK = process.env.NEXT_PUBLIC_MOCK_AI === 'true';

export async function generatePlan(profile: UserProfile) {
  if (USE_MOCK) {
    return mockGeneratePlan(profile);
  }
  return realAIGeneratePlan(profile);
}
```

Set in `.env.local`:
```
NEXT_PUBLIC_MOCK_AI=true
```

### Rule 4: Feature Flags
Use feature flags to disable incomplete features:

```typescript
// /components/chat/ChatInterface.tsx
const AI_ENABLED = process.env.NEXT_PUBLIC_ENABLE_AI === 'true';

export function ChatInterface() {
  if (!AI_ENABLED) {
    return <ComingSoonMessage />;
  }
  return <ActualChat />;
}
```

---

## Merge Process

### When You Finish Your Phase

1. **Self-Review Checklist**
   - [ ] All tasks from `PHASES.md` completed
   - [ ] Acceptance criteria met
   - [ ] No TypeScript errors
   - [ ] Tests pass (if applicable)
   - [ ] No files from other phases edited
   - [ ] Handoff notes documented

2. **Update Phase Status**
```json
{
  "phase-X": {
    "status": "completed",
    "assignedTo": "your-name",
    "completedAt": "2025-11-08T18:00:00Z",
    "branch": "phase-X-your-name"
  }
}
```

3. **Create Pull Request**
   - Title: `[Phase X] Feature Name`
   - Description: Copy acceptance criteria from `PHASES.md`
   - Check off completed items
   - Add screenshots/videos if UI changes

4. **Request Review**
   - Tag team lead
   - Tag anyone whose phase depends on yours

5. **After Merge**
   - Delete your feature branch
   - Pull latest `main`
   - Celebrate! 🎉

---

## Common Scenarios

### Scenario 1: "I just pulled the repo, what do I do?"

```bash
# Step 1: Read documentation
cat PHASES.md         # Understand phases
cat DEVELOPMENT.md    # This file

# Step 2: Ask the agent
# In Replit chat or your tool:
"Which phase should I work on? I'm comfortable with [frontend/backend/both]"

# Step 3: Agent will:
# - Check .phase-status.json
# - Verify dependencies
# - Recommend a phase
# - Explain how to start

# Step 4: Follow agent's instructions
# Agent will help you:
# - Update .phase-status.json
# - Create your branch
# - Set up environment variables
# - Understand your tasks
```

### Scenario 2: "My phase depends on Phase X, but it's not done yet"

**Option A: Use Mocks (Recommended)**
```typescript
// Create mock in your phase
// /lib/mocks/phase-X-mock.ts
export function mockFunctionFromPhaseX() {
  return { /* realistic fake data */ };
}
```

**Option B: Wait (Not Recommended)**
- Only if mocking is too difficult
- Communicate with Phase X developer
- Work on other tasks in your phase

**Option C: Help Phase X**
- Coordinate with that developer
- Work together to unblock

### Scenario 3: "I need to change a file another phase owns"

**❌ Don't do it!**

Instead:
1. Create an issue documenting the need
2. Discuss with file owner
3. They make the change, or
4. Get approval to edit with clear commit message

**Example:**
```bash
# If you MUST edit Phase 2's file from Phase 3:
git commit -m "phase-3: Update db types for timeline feature (approved by Phase 2 owner)"
```

### Scenario 4: "Phase X merged, now I have conflicts"

```bash
# Step 1: Save your work
git add .
git commit -m "WIP: saving before merge"

# Step 2: Get latest main
git checkout main
git pull origin main

# Step 3: Merge into your branch
git checkout phase-X-your-name
git merge main

# Step 4: Resolve conflicts
# - Keep shared contract changes from main
# - Keep your phase-specific changes
# - Test thoroughly

git add .
git commit -m "phase-X: Merge main, resolve conflicts"
```

---

## Environment Setup

### Required Environment Variables

Create `.env.local` (NEVER commit this):

```bash
# Phase 2: Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Phase 4: AI Integration
GOOGLE_GEMINI_API_KEY=...

# Feature Flags
NEXT_PUBLIC_ENABLE_AI=false        # true when Phase 4 done
NEXT_PUBLIC_MOCK_DATA=true         # false when Phase 2 done
NEXT_PUBLIC_MOCK_AI=true           # false when Phase 4 done

# Replit specific (auto-provided)
REPLIT_DB_URL=...
```

### Getting API Keys

**Clerk (Phase 2):**
1. Go to https://clerk.com
2. Create free account
3. Create application
4. Copy publishable and secret keys

**Google Gemini (Phase 4):**
1. Go to https://ai.google.dev
2. Get API key (100% free)
3. Copy key

**Replit DB:**
- Automatically provided in Replit environment
- No setup needed

---

## Testing Your Phase

### Run Dev Server
```bash
npm run dev
# Server starts on http://0.0.0.0:5000
# Access in Replit preview pane
```

### Check for Errors
```bash
# TypeScript errors
npm run build

# Linting
npm run lint
```

### Manual Testing Checklist
Each phase has specific acceptance criteria in `PHASES.md`. For example:

**Phase 3 Testing:**
- [ ] Onboarding flow completes
- [ ] Calendar displays correctly
- [ ] Timeline shows tasks
- [ ] Can edit upcoming tasks
- [ ] Past tasks are locked
- [ ] Mobile responsive

---

## Getting Help

### Agent Assistance
The Replit Agent can help you:

**Starting a phase:**
```
"I want to work on Phase 3. Can you:
1. Check if dependencies are met
2. Explain what I need to build
3. Help me set up my branch"
```

**During development:**
```
"I'm working on the Timeline component (Phase 3).
How should I structure the hourly grid to avoid conflicts
with the AI updates from Phase 4?"
```

**Before merging:**
```
"Review my Phase 3 changes. Have I:
1. Completed all tasks?
2. Met acceptance criteria?
3. Avoided editing other phases' files?"
```

### Team Communication
- **Slack/Discord**: Daily standups
- **GitHub Issues**: Track blockers
- **PR Comments**: Code review
- **.phase-status.json**: Current progress

---

## Architecture Decisions

See `replit.md` for:
- Why we chose this tech stack
- Database schema rationale
- State management approach
- Performance considerations

---

## Tips for Success

1. **Read First, Code Second**
   - 30 minutes reading docs saves 3 hours of conflicts

2. **Communicate Early**
   - Ask questions before making assumptions
   - Share blockers immediately

3. **Test Incrementally**
   - Don't wait until phase completion
   - Test each task as you finish

4. **Use the Agent**
   - Agent knows the full plan
   - Ask for guidance frequently

5. **Follow the Process**
   - Update `.phase-status.json`
   - Create proper branches
   - Write clear commits

6. **Think About Handoff**
   - Document your decisions
   - Leave clear TODOs
   - Update type definitions

---

## Project Structure Reference

```
flowmate/
├── app/                      # Next.js app directory
│   ├── (dashboard)/         # Phase 3: Main app routes
│   ├── api/                 # Phase 2: API routes
│   ├── analytics/           # Phase 5: Analytics pages
│   ├── onboarding/          # Phase 3: Onboarding flow
│   ├── settings/            # Phase 5: Settings pages
│   └── layout.tsx           # Phase 1: Root layout
├── components/              # React components
│   ├── ui/                  # Phase 1: Base components
│   ├── calendar/            # Phase 3: Calendar components
│   ├── timeline/            # Phase 3: Timeline components
│   ├── chat/                # Phase 4: AI chat
│   ├── charts/              # Phase 5: Analytics charts
│   └── onboarding/          # Phase 3: Onboarding forms
├── lib/                     # Utilities
│   ├── db/                  # Phase 2: Database utilities
│   ├── ai/                  # Phase 4: AI client
│   ├── mocks/               # All: Mock data
│   └── utils.ts             # Phase 1: Shared utilities
├── stores/                  # Zustand stores
│   ├── auth.ts              # Phase 2: Auth state
│   ├── user.ts              # Phase 2: User profile
│   ├── plan.ts              # Phase 3: Daily plan
│   └── feedback.ts          # Phase 4: Feedback state
├── types/                   # TypeScript types
│   ├── shared.ts            # Phase 1: Shared types
│   └── database.ts          # Phase 2: DB types
├── PHASES.md                # This file - Phase breakdown
├── DEVELOPMENT.md           # You are here
├── replit.md                # Architecture decisions
├── .phase-status.json       # Current phase status
└── README.md                # User-facing documentation
```

---

## Next Steps

1. **Read `PHASES.md`** to understand the full scope
2. **Check `.phase-status.json`** to see current status
3. **Ask the agent:** "Which phase should I work on?"
4. **Follow the workflow** described in this document

Good luck building FlowMate! 🚀

---

**Last Updated:** November 8, 2025  
**Questions?** Ask in team chat or consult the agent
