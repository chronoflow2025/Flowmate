# 🚨 IMPORTANT: DO NOT BUILD YET - READ THIS FIRST

## FlowMate - AI-Powered Productivity Assistant

**FlowMate** is an AI assistant that optimizes your day based on your **focus patterns, habits, and calendar activity**. It learns how you work best and builds a personalized **time-flow plan** for each day — helping you maintain deep focus, avoid burnout, and maximize productive hours.

---

## ⚠️ FOR DEVELOPERS: READ BEFORE STARTING

This project uses a **phased development approach** designed for multiple team members to work in parallel without conflicts.

### 🛑 BEFORE YOU RUN `npm install`:

1. **Read the documentation:**
   - 📋 **[DEVELOPMENT.md](./DEVELOPMENT.md)** - Start here! Contains workflow instructions
   - 📊 **[PHASES.md](./PHASES.md)** - Detailed breakdown of all 5 phases
   - 🏗️ **[replit.md](./replit.md)** - Architecture decisions and project overview

2. **Check phase status:**
   - Open `.phase-status.json` to see what's available
   - Ensure dependencies are met before claiming a phase

3. **Ask for guidance:**
   - Use Replit Agent: "Which phase should I work on?"
   - Agent will analyze current status and recommend next steps

4. **Claim your phase:**
   - Update `.phase-status.json` with your name
   - Create branch: `git checkout -b phase-X-your-name`
   - Follow conflict prevention rules in DEVELOPMENT.md

### 📚 Quick Links
- 🚀 **[QUICKSTART.md](./QUICKSTART.md)** - **START HERE!** Step-by-step first actions
- [Development Workflow](./DEVELOPMENT.md) - How to work on this project
- [Phase Breakdown](./PHASES.md) - What each phase builds
- [Architecture](./replit.md) - Technical decisions and setup

---

## Project Overview

### Tech Stack
- **Frontend:** Next.js 15 (App Router) + TypeScript + Tailwind CSS
- **Backend:** Next.js API Routes
- **Database:** Replit DB (Key-Value Store)
- **AI:** Google Gemini API (100% Free)
- **Auth:** Clerk (Google OAuth + Guest Mode)
- **State:** Zustand
- **Charts:** Recharts

### Core Features
1. **AI Timesheet Generation** - Tomorrow's optimized schedule
2. **Feedback Loop** - Focus ratings improve future plans
3. **Interactive Timeline** - Edit tasks, set priorities (1.0-5.0)
4. **Analytics Dashboard** - 30-day trends, heatmaps, insights
5. **Smart Learning** - AI adapts to your productivity patterns

### Development Phases

| Phase | Focus | Time | Status |
|-------|-------|------|--------|
| **Phase 1** | Foundation & DevOps | 1.5-2 days | ✅ Completed |
| **Phase 2** | Auth & Data Layer | 2-2.5 days | ✅ Completed |
| **Phase 3** | Core UI Components | 3-3.5 days | ✅ Completed |
| **Phase 4** | AI Integration | 2-3 days | ✅ Completed |
| **Phase 5** | Analytics & Polish | 2 days | ✅ Completed |

**Total:** 10.5-13 days for full MVP - **All phases complete!**

---

## Getting Started (After Reading Docs!)

### Prerequisites
- Node.js 20+
- npm or yarn
- Replit account (for deployment)
- Clerk account (for auth)
- Google Gemini API key (free)

### Installation
```bash
# 1. Clone and read docs first!
git clone <repo-url>
cd flowmate

# 2. Read the documentation
cat DEVELOPMENT.md

# 3. Check phase status
cat .phase-status.json

# 4. Ask agent which phase to work on
# (Use Replit Agent or your AI assistant)

# 5. Install dependencies
npm install

# 6. Set up environment variables
cp .env.example .env.local
# Add your API keys (see DEVELOPMENT.md)

# 7. Run development server
npm run dev
# Server will start on http://0.0.0.0:5000
```

### Environment Variables
```bash
# Required for Phase 2+
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Required for Phase 4+
GOOGLE_GEMINI_API_KEY=...

# Replit (auto-provided in Replit environment)
REPLIT_DB_URL=...

# Feature Flags (for phased development)
NEXT_PUBLIC_ENABLE_AI=false
NEXT_PUBLIC_MOCK_DATA=true
```

---

## Project Structure

```
flowmate/
├── app/                      # Next.js app directory
│   ├── (dashboard)/         # Main app routes (Phase 3)
│   ├── api/                 # API routes (Phase 2)
│   ├── analytics/           # Analytics pages (Phase 5)
│   └── onboarding/          # Onboarding flow (Phase 3)
├── components/              # React components
│   ├── ui/                  # Base components (Phase 1)
│   ├── calendar/            # Calendar (Phase 3)
│   ├── timeline/            # Timeline (Phase 3)
│   └── chat/                # AI chat (Phase 4)
├── lib/                     # Utilities
│   ├── db/                  # Database (Phase 2)
│   └── ai/                  # AI client (Phase 4)
├── stores/                  # Zustand stores (Phase 1)
├── types/                   # TypeScript types (Phase 1)
├── PHASES.md                # Phase breakdown
├── DEVELOPMENT.md           # Development guide
└── replit.md                # Architecture docs
```

---

## Key Features Breakdown

### 1. Focus Mode Timeline
- Hourly grid (3 AM → 3 AM next day)
- Color-coded priorities (1.0-5.0 scale)
- Edit upcoming tasks, lock past events
- Drag-and-drop scheduling (optional)

### 2. AI Plan Generation
- Generates tomorrow's plan only
- Uses: profile, habits, peak hours, past feedback
- Learns from focus ratings over time
- Chat commands: "Move meeting to 2 PM"

### 3. Feedback System
- Toast appears 2 mins before task ends
- Collects: Focus (1-10), Completion (%), Notes
- Stores for pattern analysis
- Improves future AI suggestions

### 4. Analytics Dashboard
- 30-day productivity trend
- Weekly heatmap
- Time-of-day activity graph
- Focus vs. completion scatter plot
- AI-generated insights

### 5. Smart Learning
- Identifies peak performance hours
- Detects habit correlations (e.g., coffee → focus boost)
- Suggests optimal break times
- Adapts to changing patterns

---

## Development Rules

### Conflict Prevention
1. **File Ownership:** Only edit files your phase owns
2. **Shared Types:** Import from `/types/shared.ts`
3. **Feature Flags:** Use for incomplete features
4. **Mock Services:** Don't block on other phases

### Branching Strategy
- Main branch: `main` (protected)
- Phase branches: `phase-1`, `phase-2`, etc.
- Personal branches: `phase-X-your-name`
- Merge only when phase complete

### Communication
- Update `.phase-status.json` when starting/completing
- Leave TODO comments with your name
- Document deviations in commit messages
- Ask agent for guidance when stuck

---

## Testing

### Run Tests
```bash
# Lint
npm run lint

# Type check
npm run build

# Local testing
npm run dev
```

### Phase-Specific Testing
Each phase has acceptance criteria in `PHASES.md`:
- Phase 1: Server starts, no errors
- Phase 2: Auth works, DB CRUD functional
- Phase 3: UI interactive, state persists
- Phase 4: AI generates plans, feedback stores
- Phase 5: Charts render, settings save

---

## Deployment

### Deploy to Replit
1. Complete all phases
2. Set production environment variables
3. Run production build: `npm run build`
4. Deploy via Replit interface
5. Test at `<your-repl>.replit.app`

### Production Checklist
- [ ] All environment variables set
- [ ] Production build succeeds
- [ ] Auth flows work
- [ ] Database connections stable
- [ ] AI API key valid
- [ ] Charts render with real data

---

## Cost Analysis

**Total MVP Cost: $0/month** 🎉

- Next.js: Free (self-hosted)
- Replit DB: Free (basic tier)
- Clerk Auth: Free (10K MAU)
- Google Gemini: Free (250 req/day)
- Replit Deployment: Free (Autoscale tier)

---

## Support

### Questions?
1. Check `DEVELOPMENT.md` for workflow
2. Check `PHASES.md` for phase details
3. Check `replit.md` for architecture
4. Ask Replit Agent: "Help me with [specific issue]"
5. Create GitHub issue if needed

### Common Issues
- **Port conflicts:** Ensure using port 5000
- **Type errors:** Import from `/types/shared.ts`
- **Merge conflicts:** Follow file ownership rules
- **Missing API keys:** Check `.env.example`

---

## Contributing

This is a hackathon MVP built with phased development. Follow these steps:

1. Read `DEVELOPMENT.md` thoroughly
2. Check `.phase-status.json` for availability
3. Ask agent which phase to work on
4. Claim phase and create branch
5. Build according to `PHASES.md` specifications
6. Test against acceptance criteria
7. Create PR when complete
8. Update phase status to "completed"

**Remember:** Communication prevents conflicts. Update status files and ask questions early!

---

## License

MIT (or specify your license)

---

## Acknowledgments

Built for [Hackathon Name] using:
- Next.js 15
- Google Gemini AI
- Clerk Authentication
- Replit Platform

**Last Updated:** November 8, 2025

