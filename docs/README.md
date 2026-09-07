# VibeCodeLive (TeachView Live) - Developer Documentation

Welcome to the comprehensive developer documentation for **VibeCodeLive** (also referred to as **TeachView Live**). This platform bridges teachers and students in real-time collaborative coding classrooms, capturing live telemetry from students' Monaco code editors and evaluating engagement, struggles, and potential plagiarism using heuristic tracking and AI.

---

## Documentation Navigation

| Document | Description |
|---|---|
| [System Architecture](file:///c:/Users/AmanNagar/teachview-live/docs/architecture.md) | High-level system architecture, process boundaries, Socket.IO architecture, security & rate-limiting model. |
| [Project Structure](file:///c:/Users/AmanNagar/teachview-live/docs/project-structure.md) | Exhaustive folder and file catalog with path references and module roles. |
| [Authentication & Authorization](file:///c:/Users/AmanNagar/teachview-live/docs/authentication.md) | Dual-token authentication (Access JWT + Refresh Token rotation), Google OAuth, staged registration, and OTP password recovery. |
| [API Reference](file:///c:/Users/AmanNagar/teachview-live/docs/api-reference.md) | Comprehensive REST API contract specifications for all endpoints across auth, meetings, execution, and AI telemetry. |
| [Data Flows & Sequence Diagrams](file:///c:/Users/AmanNagar/teachview-live/docs/data-flows.md) | Step-by-step end-to-end data flows with Mermaid sequence diagrams. |
| [Frontend Architecture](file:///c:/Users/AmanNagar/teachview-live/docs/frontend.md) | Next.js 16 App Router, Parallel Routes (`@left` / `@right`), Redux Toolkit store, custom hooks, and Monaco editor integration. |
| [Backend Architecture & Socket Server](file:///c:/Users/AmanNagar/teachview-live/docs/backend.md) | Route handlers, controller/service abstraction, request guards, and dual Socket.IO server implementations. |
| [Database Models & Schemas](file:///c:/Users/AmanNagar/teachview-live/docs/database.md) | MongoDB Atlas connection pool, Mongoose schemas (`User`, `Meeting`, `RefreshToken`, `EmailVerification`, `OTP`), indexes, and TTLs. |
| [Utilities & Helpers](file:///c:/Users/AmanNagar/teachview-live/docs/utilities.md) | Zod validation schemas, email dispatchers, session summarizers, and custom Monaco themes. |
| [Testing Structure](file:///c:/Users/AmanNagar/teachview-live/docs/testing.md) | Performance load testing with k6, test credential pools, and recommended automated testing suite. |
| [Deployment & Operations](file:///c:/Users/AmanNagar/teachview-live/docs/deployment.md) | Environment variables matrix, multi-process deployment strategy (Next.js + Socket.IO daemon), and technical debt catalog. |

---

## Technology Stack Summary

| Layer | Technology | Primary Source File(s) |
|---|---|---|
| **Framework** | Next.js 16.1.4 (React 19.2.0, App Router) | [`package.json`](file:///c:/Users/AmanNagar/teachview-live/package.json), [`next.config.ts`](file:///c:/Users/AmanNagar/teachview-live/next.config.ts) |
| **State Management** | Redux Toolkit 2.11.2 & React-Redux 9.2.0 | [`store/index.js`](file:///c:/Users/AmanNagar/teachview-live/store/index.js) |
| **Styling & Animation** | Tailwind CSS v4, Framer Motion 12.23, Anime.js | [`app/globals.css`](file:///c:/Users/AmanNagar/teachview-live/app/globals.css) |
| **Code Editor** | Monaco Editor (`@monaco-editor/react` 4.7.0) | [`utils/Editor_Customization.jsx`](file:///c:/Users/AmanNagar/teachview-live/utils/Editor_Customization.jsx) |
| **Split Views** | React-Split 2.0.14 | [`components/Member/Base.tsx`](file:///c:/Users/AmanNagar/teachview-live/components/Member/Base.tsx) |
| **Real-time Server** | Node.js + Express 5.2.1 + Socket.IO 4.8.3 | [`socket/src/index.js`](file:///c:/Users/AmanNagar/teachview-live/socket/src/index.js), [`socket/server.js`](file:///c:/Users/AmanNagar/teachview-live/socket/server.js) |
| **Database** | MongoDB Atlas with Mongoose 8.20.1 | [`lib/db.js`](file:///c:/Users/AmanNagar/teachview-live/lib/db.js), [`models/`](file:///c:/Users/AmanNagar/teachview-live/models/) |
| **Rate Limiting** | Upstash Redis REST Client & Ratelimit | [`lib/redis.js`](file:///c:/Users/AmanNagar/teachview-live/lib/redis.js), [`lib/rateLimiter.js`](file:///c:/Users/AmanNagar/teachview-live/lib/rateLimiter.js) |
| **Authentication** | NextAuth v4 (Google OAuth) + Custom JWT | [`app/api/auth/[...nextauth]/route.ts`](file:///c:/Users/AmanNagar/teachview-live/app/api/auth/%5B...nextauth%5D/route.ts), [`lib/tokens.js`](file:///c:/Users/AmanNagar/teachview-live/lib/tokens.js) |
| **Code Execution** | Judge0 CE via RapidAPI | [`app/api/run/route.js`](file:///c:/Users/AmanNagar/teachview-live/app/api/run/route.js) |
| **AI Evaluation** | Anthropic Claude Messages API (Claude 3.5 Sonnet) | [`app/api/meeting/snapShot/util.js`](file:///c:/Users/AmanNagar/teachview-live/app/api/meeting/snapShot/util.js) |
| **Email Service** | Nodemailer with Gmail SMTP transport | [`utils/sendEmail.js`](file:///c:/Users/AmanNagar/teachview-live/utils/sendEmail.js) |
| **Validation** | Zod 4.2.1 | [`utils/registerSchema.js`](file:///c:/Users/AmanNagar/teachview-live/utils/registerSchema.js) |

---

## Quick Reference: Running the System Locally

1. **Install Root Dependencies**:
   ```bash
   npm install
   ```
2. **Install Socket Server Dependencies**:
   ```bash
   cd socket
   npm install
   cd ..
   ```
3. **Configure Environment Variables**:
   Copy `.env.example` to `.env.local` or `.env` and supply the required connection strings and secrets (see [Environment Variables Reference](file:///c:/Users/AmanNagar/teachview-live/docs/deployment.md#environment-variables-reference)).
4. **Run the Next.js Frontend & API**:
   ```bash
   npm run dev
   # Runs on http://localhost:3000
   ```
5. **Run the Socket.IO Server**:
   ```bash
   npm run socket
   # Runs on http://localhost:3001
   # OR for the modular version:
   cd socket && npm run dev
   # Runs on http://localhost:4000
   ```
