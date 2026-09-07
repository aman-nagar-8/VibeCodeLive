# Project Structure & Module Inventory

## 1. Directory Tree

```
teachview-live/
├── .env.example
├── README.md
├── docs/
├── k6-tests/
├── app/
│   ├── layout.tsx
│   ├── providers.jsx
│   ├── page.tsx
│   ├── about/page.js
│   ├── contact/page.js
│   ├── class/page.js
│   ├── login/
│   │   ├── page.js
│   │   ├── forget-password/
│   │   │   ├── Button.jsx
│   │   │   ├── Forms.jsx
│   │   │   └── page.js
│   │   └── register/
│   │       ├── page.js
│   │       └── VerifyEmail/
│   │           ├── page.js
│   │           └── verifyEmailClient.js
│   ├── meeting/
│   │   ├── page.js
│   │   ├── create/page.js
│   │   ├── join/page.js
│   │   ├── admin/[id]/
│   │   │   ├── layout.tsx
│   │   │   └── page.js
│   │   └── member/[id]/
│   │       ├── layout.tsx
│   │       ├── page.js
│   │       ├── @left/
│   │       │   ├── default.tsx
│   │       │   ├── page.tsx
│   │       │   ├── code/page.js
│   │       │   ├── problems/page.js
│   │       │   ├── resourses/page.js
│   │       │   └── whiteboard/page.js
│   │       └── @right/
│   │           ├── default.tsx
│   │           ├── page.tsx
│   │           ├── about/page.js
│   │           ├── comments/page.js
│   │           ├── members/page.js
│   │           ├── notes/page.js
│   │           └── user-code/
│   │               ├── UseStudentTracking.js
│   │               ├── page.js
│   │               ├── demo.js
│   │               └── demo01.js
│   └── api/
│       ├── auth/
│       │   ├── [...nextauth]/route.ts
│       │   └── set-refresh-token/route.ts
│       ├── createmeeting/route.js
│       ├── getmeeting/route.js
│       ├── getUser/route.js
│       ├── joinmeeting/route.js
│       ├── run/route.js
│       ├── login/
│       │   ├── route.js
│       │   ├── refresh/route.js
│       │   ├── logout/route.js
│       │   ├── register/route.js
│       │   ├── verify-email/route.js
│       │   └── forgotpassword/
│       │       ├── generateOTP/route.js
│       │       ├── verifyOTP/route.js
│       │       └── changepassword/route.js
│       └── meeting/
│           ├── getCurrentMeeting/route.js
│           └── snapShot/
│               ├── route.js
│               └── util.js
├── components/
│   ├── Footer.jsx
│   ├── Navbar.jsx
│   ├── New_home.jsx
│   ├── Profile.jsx
│   ├── home/Join_session_btn.jsx
│   ├── admin/
│   │   ├── Base.jsx
│   │   ├── CodeEditor.jsx
│   │   ├── Code_editor.js
│   │   ├── Member.jsx
│   │   ├── SimpleCode.js
│   │   ├── UserCard.jsx
│   │   └── member_list.js
│   ├── Member/
│   │   ├── Admin_info_section.tsx
│   │   ├── Base.tsx
│   │   ├── Controles.tsx
│   │   ├── Nav_Link.tsx
│   │   ├── Navigation.tsx
│   │   └── Profile_info_section.tsx
│   └── joinMeeting/
│       ├── EmptyState.tsx
│       ├── JoinSection.jsx
│       ├── LoadingSection.jsx
│       ├── MeetingDetailsCard.jsx
│       ├── MeetingSuggestions.jsx
│       ├── SearchArea.jsx
│       ├── StepCircle.jsx
│       └── StepConnector.jsx
├── context/
│   └── socketContext.tsx
├── lib/
│   ├── apiClient.js
│   ├── cleanupEmailVerifications.js
│   ├── connectsocket.js
│   ├── db.js
│   ├── errors.js
│   ├── getAccessToken.js
│   ├── getUserFromRequest.js
│   ├── hashToken.js
│   ├── rateLimiter.js
│   ├── redis.js
│   ├── snapShotSender.js
│   ├── socketService.ts
│   └── tokens.js
├── models/
│   ├── EmailVerification.js
│   ├── Meeting.js
│   ├── OTP.model.js
│   ├── RefreshToken.js
│   └── User.model.js
├── socket/
│   ├── package.json
│   ├── server.js
│   └── src/
│       ├── index.js
│       └── socket/
│           ├── auth.middleware.js
│           ├── index.js
│           └── meeting.socket.js
├── store/
│   ├── index.js
│   ├── joinMeetingSlice.js
│   ├── meetingSlice.ts
│   ├── types.ts
│   └── userSlice.js
└── utils/
    ├── changePasswordTemplate.js
    ├── debounce.js
    ├── Editor_Customization.jsx
    ├── registerSchema.js
    ├── sendEmail.js
    ├── sessionSummary.js
    └── verificationEmailTemplate.js
```

---

## 2. Core Modules Specification

### 2.1 State Management & Context (`store/`)

#### [`store/index.js`](file:///c:/Users/AmanNagar/teachview-live/store/index.js)
- **Purpose**: Root Redux store configuration.
- **Imports**: `@reduxjs/toolkit`, `./userSlice`, `./joinMeetingSlice`, `./meetingSlice`.
- **Exports**: `store`.
- **Consumers**: [`app/providers.jsx`](file:///c:/Users/AmanNagar/teachview-live/app/providers.jsx), [`lib/socketService.ts`](file:///c:/Users/AmanNagar/teachview-live/lib/socketService.ts).

#### [`store/meetingSlice.ts`](file:///c:/Users/AmanNagar/teachview-live/store/meetingSlice.ts)
- **Purpose**: Tracks real-time room status, normalized participant rosters, and student telemetry snapshots.
- **Imports**: `@reduxjs/toolkit`, `./types`.
- **Key State**:
  - `meetingId`: string | null
  - `connectionStatus`: `"connected" | "disconnected" | "connecting"`
  - `participants`: `{ byId: Record<string, Participant>, allIds: string[] }`
- **Actions**: `setMeetingId`, `userJoined`, `userLeft`, `setParticipants`, `updateSnapshot`, `setConnectionStatus`, `resetMeeting`.

#### [`store/joinMeetingSlice.js`](file:///c:/Users/AmanNagar/teachview-live/store/joinMeetingSlice.js)
- **Purpose**: Coordinates meeting discovery, dynamic form inputs, and stepper stages.
- **Key State**: `meeting` (selected meeting), `formData` (custom fields object), `currentStep` (0 to 2).
- **Actions**: `setMeeting`, `setFormDate`, `setCurrentStep`.

---

### 2.2 Client Infrastructure & Services (`lib/`)

#### [`lib/apiClient.js`](file:///c:/Users/AmanNagar/teachview-live/lib/apiClient.js)
- **Purpose**: Pre-configured Axios instance handling Bearer authorization and transparent 401 token refresh.
- **Data Flow**:
  - Outgoing requests: Injects `Authorization: Bearer <accessToken>` from module-scoped memory.
  - Incoming 401 response: Triggers retry logic by issuing a refresh request and updating default headers.
- **Exports**: `setAccessToken(token)`, `api` (default).

#### [`lib/socketService.ts`](file:///c:/Users/AmanNagar/teachview-live/lib/socketService.ts)
- **Purpose**: Client-side Socket.IO lifecycle manager.
- **Imports**: `socket.io-client`, [`store`](file:///c:/Users/AmanNagar/teachview-live/store), actions from [`store/meetingSlice`](file:///c:/Users/AmanNagar/teachview-live/store/meetingSlice.ts).
- **Socket Events Handled**:
  - `connect` -> dispatches `setConnectionStatus("connected")`.
  - `disconnect` -> dispatches `setConnectionStatus("disconnected")`.
  - `meeting-members` -> dispatches `setParticipants(members)`.
  - `user-joined` -> dispatches `userJoined(data.user)`.
  - `user-left` -> dispatches `userLeft(data.userId)`.
  - `receive-code-snapshot` -> dispatches `updateSnapshot({ userId: from, snapshot })`.
- **Exports**: `connectSocket(token)`, `joinMeeting(meetingId)`, `sendCodeSnapshot(meetingId, snapshot)`, `disconnectSocket()`.

#### [`lib/db.js`](file:///c:/Users/AmanNagar/teachview-live/lib/db.js)
- **Purpose**: Singleton database connection manager for Mongoose and MongoDB Atlas.
- **Mechanism**: Maintains a `cached` connection promise on Node.js `global.mongoose` to avoid re-opening connections across serverless functions or hot reloads.
- **Exports**: `connectDB()`.

#### [`lib/getUserFromRequest.js`](file:///c:/Users/AmanNagar/teachview-live/lib/getUserFromRequest.js)
- **Purpose**: Authorization guard extracting and verifying JWT bearer tokens from incoming HTTP requests.
- **Throws**: [`ApiError`](file:///c:/Users/AmanNagar/teachview-live/lib/errors.js) with 401 code (`LOGIN_REQUIRED` or `SESSION_EXPIRED`).
- **Exports**: `getUserFromRequest(req)`.

---

### 2.3 Student Behavioral Tracking Engine (`app/meeting/.../@right/user-code/`)

#### [`UseStudentTracking.js`](file:///c:/Users/AmanNagar/teachview-live/app/meeting/member/%5Bid%5D/@right/user-code/UseStudentTracking.js)
- **Purpose**: In-browser telemetry collection engine without causing component re-renders.
- **Events Monitored**:
  - `onKeyDown`: Keystroke counts, backspace counts, line cursor repeat tracking.
  - `onDidPaste`: Large paste detection (>50 chars).
  - `visibilitychange`: Browser tab switches.
  - `Output` prop: Error history, repeated errors (3+ same error), high error rate (5+ errors), and solution similarity comparison.
  - Periodic timer (2 min): Emits `onSnapshot` with full metrics payload.
- **Exports**: `useStudentTracking(options)`.

---

### 2.4 Admin & Student Visual Workspace (`components/admin/` & `components/Member/`)

#### [`components/admin/UserCard.jsx`](file:///c:/Users/AmanNagar/teachview-live/components/admin/UserCard.jsx)
- **Purpose**: Real-time student progress monitor for teachers.
- **Data Source**: Selects `user` from `state.meeting.participants.byId[userId]`.
- **Visuals**: Displays student name, roll number, engagement percentage score, active status pill, behavior badges, and expandable 5-point AI summary cards.

#### [`components/admin/CodeEditor.jsx`](file:///c:/Users/AmanNagar/teachview-live/components/admin/CodeEditor.jsx)
- **Purpose**: Teacher Monaco editor instance with vertically resizable split output pane.

#### [`components/Member/Base.tsx`](file:///c:/Users/AmanNagar/teachview-live/components/Member/Base.tsx)
- **Purpose**: Horizontal resizable split container for student workspace. Hosts navigation links and embeds parallel route slot views.
