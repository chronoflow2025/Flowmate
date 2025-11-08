# FlowMate - Project Overview & Architecture

### Overview
FlowMate is an AI-powered productivity assistant designed to generate personalized daily schedules. It optimizes time allocation and enhances productivity by learning from user behavior, task lists, and calendar events. The project aims to provide an AI-first planning experience, helping users maximize their productive hours and manage their daily routines effectively.

### User Preferences
- **Development Approach:** Phased development with clear ownership.
- **Communication:** All architectural decisions should be documented.
- **Code Style:** Adhere to TypeScript strict mode and ESLint enforcement.
- **Commits:** Commit messages should be descriptive and include a phase prefix.
- **Code Conventions:**
    - Use functional components exclusively (no class components).
    - Prefer server components, using 'use client' only when absolutely necessary.
    - File names should be in kebab-case (e.g., `user-profile.tsx`).
    - Export only one main component per file.
    - Co-locate types with components if they are component-specific.

### System Architecture

**UI/UX Decisions:**
- **Styling:** Tailwind CSS and shadcn/ui for rapid development, consistent design, and accessible components.
- **Calendar:** React Big Calendar for customizable date picking and badging.
- **Charts:** Recharts for native React charting, composable and well-documented.

**Technical Implementations:**
- **Frontend Framework:** Next.js 15 with App Router for server-side rendering, built-in API routes, and strong TypeScript support.
- **Language:** TypeScript for type safety, improved developer experience, and better code maintainability.
- **State Management:** Zustand for its simplicity, TypeScript-first approach, and minimal boilerplate. Optimistic UI updates are used for a responsive user experience.
- **Monorepo:** Frontend and backend are combined in a single Next.js project for simplified deployment, shared types, and faster development.
- **AI-First Plan Generation:** The AI generates plans only for the *next* day to prevent mid-day disruptions, allow user review, and streamline the feedback loop.
- **Authentication:** Clerk is used for authentication, offering a free tier, Google OAuth, guest mode, and seamless Next.js integration.
- **API Design:** Follows REST conventions with consistent error handling and requires Clerk session for authenticated routes.
- **Performance:** Focus on bundle size reduction (dynamic imports, tree-shaking, lazy loading), SWR pattern for data caching, and prefetching.
- **Security:** API keys are stored in environment variables, user data is scoped by `userId` to prevent leakage, and all API inputs are validated with Zod schemas.

**Feature Specifications:**
- Personalized daily schedules based on user profile, historical feedback, calendar events, and activity patterns.
- Task management within the generated plan (CRUD operations).
- Feedback mechanism for focus and completion rates.
- Daily productivity scoring.
- User settings for notifications, appearance, and privacy.

### External Dependencies

- **Database:** Replit DB (Key-Value Store) for its simplicity, built-in rollback support, and suitability for MVP requirements.
- **AI:** Google Gemini API for AI plan generation, leveraging its free tier and structured output capabilities.
- **Authentication:** Clerk for user authentication and authorization.
- **Deployment:** Replit Autoscale for zero-config, automatic scaling, and rollback features.