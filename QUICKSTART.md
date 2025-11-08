# FlowMate - Quick Start Guide

## 🚀 For New Team Members

You've just pulled this repo. **STOP and read this first!**

### What is FlowMate?
An AI-powered productivity assistant that generates personalized daily schedules based on your focus patterns, habits, and calendar events.

### Why is this different?
This project uses a **phased development approach** where 5 different developers can work in parallel on different features without causing merge conflicts.

---

## 📋 Step-by-Step: Your First Action

### Step 1: Read the Documentation (5 minutes)
```bash
# Essential reading (in order):
1. This file (QUICKSTART.md) - You are here ✓
2. DEVELOPMENT.md - Workflow and conflict prevention
3. PHASES.md - What each phase builds
4. replit.md - Architecture decisions
```

### Step 2: Check What's Available
```bash
cat .phase-status.json
```

Look for phases with:
- `"status": "not-started"` - Available to claim
- `"dependencies": []` or all dependencies `"completed"` - You can start

### Step 3: Ask the Agent
In your terminal or Replit Agent chat:
```
"Which phase should I work on? I'm comfortable with [frontend/backend/both]"
```

The agent will:
- ✅ Check which phases are available
- ✅ Verify dependencies are met  
- ✅ Recommend the best phase for you
- ✅ Explain what you'll build
- ✅ Guide you through setup

### Step 4: Claim Your Phase
Update `.phase-status.json`:
```json
{
  "phase-X": {
    "status": "in-progress",
    "assignedTo": "your-github-username",
    "branch": "phase-X-your-name",
    "startedAt": "2025-11-08T10:00:00Z"
  }
}
```

Commit this immediately:
```bash
git add .phase-status.json
git commit -m "claim: Phase X by your-name"
git push
```

### Step 5: Create Your Branch
```bash
git checkout -b phase-X-your-name
```

### Step 6: Install Dependencies (if not already done)
```bash
npm install
```

### Step 7: Set Up Environment
```bash
cp .env.example .env.local
# Edit .env.local and add required keys for your phase
```

### Step 8: Start Building!
```bash
npm run dev
# Server starts on http://0.0.0.0:5000
```

Follow the tasks in `PHASES.md` for your specific phase.

---

## 🎯 Quick Reference

### Project Tech Stack
- **Frontend:** Next.js 15 + TypeScript + Tailwind CSS
- **Backend:** Next.js API Routes  
- **Database:** Replit DB (Key-Value)
- **AI:** Google Gemini API (Free)
- **Auth:** Clerk (Google OAuth + Guest)
- **State:** Zustand
- **Charts:** Recharts

### Phase Overview
| Phase | What You Build | Time | Dependencies |
|-------|----------------|------|--------------|
| **1** | Next.js setup, Tailwind, base components | 1.5-2 days | None |
| **2** | Clerk auth, Replit DB, API routes | 2-2.5 days | Phase 1 |
| **3** | Onboarding, calendar, timeline UI | 3-3.5 days | Phases 1, 2 |
| **4** | AI chat, plan generation, feedback | 2-3 days | Phases 1, 2, 3 |
| **5** | Analytics dashboard, settings, polish | 2 days | Phases 2, 3, 4 |

### Important Files You'll Edit
**Phase 1:**
- `/app/layout.tsx` - Root layout
- `/components/ui/*` - Base components
- `/stores/*` - Zustand stores
- `/types/shared.ts` - Shared types

**Phase 2:**
- `/lib/db/*` - Database utilities
- `/app/api/auth/*` - Auth routes
- `/middleware.ts` - Route protection

**Phase 3:**
- `/app/(dashboard)/*` - Main app pages
- `/components/calendar/*` - Calendar UI
- `/components/timeline/*` - Timeline UI
- `/components/onboarding/*` - Onboarding forms

**Phase 4:**
- `/lib/ai/*` - AI client
- `/app/api/plan/*` - Plan generation API
- `/app/api/chat/*` - Chat API
- `/components/chat/*` - Chat UI

**Phase 5:**
- `/app/analytics/*` - Analytics pages
- `/app/settings/*` - Settings pages
- `/components/charts/*` - Chart components

---

## ⚠️ Conflict Prevention Rules

### Rule 1: File Ownership
**Only edit files your phase owns!**
- See "Important Files You'll Edit" above
- Full list in `PHASES.md` under "Conflict Prevention"

### Rule 2: Use Shared Types
```typescript
// ✅ Good
import { Task, UserProfile } from '@/types/shared';

// ❌ Bad - creates conflicts
interface Task { ... }  // Already exists!
```

### Rule 3: Mock Missing Dependencies
If a phase you depend on isn't done:
```typescript
const USE_MOCK = process.env.NEXT_PUBLIC_MOCK_DATA === 'true';
```

### Rule 4: Update Status Often
- When you start: Update `.phase-status.json`
- Daily: Push your branch
- When done: Create PR + update status to "completed"

---

## 🔧 Common Commands

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Check TypeScript errors
npm run build

# Lint code
npm run lint

# Check phase status
cat .phase-status.json

# View your phase tasks
grep "Phase X" PHASES.md -A 50
```

---

## 💡 Tips for Success

1. **Read First, Code Second**
   - 30 mins reading docs = 3 hours saved on conflicts

2. **Ask the Agent Frequently**
   - "How should I structure this component?"
   - "Am I following the phase guidelines?"
   - "Review my changes before I commit"

3. **Communicate Early**
   - Stuck? Ask in team chat
   - Blocker? Update your phase status
   - Done? Notify dependent phase owners

4. **Test Incrementally**
   - Don't wait until the end
   - Test each task as you complete it
   - Use acceptance criteria in PHASES.md

5. **Follow the Plan**
   - Tasks are ordered for a reason
   - Don't skip ahead
   - Document any deviations

---

## 🆘 Getting Help

### Documentation
1. `DEVELOPMENT.md` - Detailed workflow guide
2. `PHASES.md` - Phase tasks and acceptance criteria
3. `replit.md` - Architecture and decisions
4. `.phase-status.json` - Real-time phase status

### Ask the Agent
```
"I'm working on Phase 3, how do I [specific question]?"
"Review my Phase X implementation"
"What's blocking Phase Y from starting?"
```

### Team Communication
- Update `.phase-status.json` with blockers
- Leave TODO comments with your name
- Tag phase owners in PRs
- Ask questions early!

---

## ✅ Before You Start Coding

- [ ] Read QUICKSTART.md (this file)
- [ ] Read DEVELOPMENT.md
- [ ] Read PHASES.md for your phase
- [ ] Check `.phase-status.json`
- [ ] Ask agent which phase to work on
- [ ] Update `.phase-status.json` with your name
- [ ] Create your branch: `phase-X-your-name`
- [ ] Set up `.env.local` with required keys
- [ ] Run `npm install`
- [ ] Run `npm run dev` to verify setup
- [ ] Read your phase's acceptance criteria

---

## 📦 What's Already Set Up

✅ Next.js 15 with TypeScript  
✅ Tailwind CSS configured  
✅ Package.json with all dependencies  
✅ Dev server runs on port 5000  
✅ Shared type definitions in `/types/shared.ts`  
✅ Phase documentation complete  
✅ Git repository initialized  

**You can start building immediately!**

---

## 🎉 Ready to Build?

1. Ask the agent: **"Which phase should I work on?"**
2. Follow the agent's instructions
3. Read your phase details in `PHASES.md`
4. Start building!

**Remember:** This is a team project. Communication prevents conflicts!

---

**Questions?** Ask the Replit Agent or check `DEVELOPMENT.md`

**Last Updated:** November 8, 2025
