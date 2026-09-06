# Data Flows & Interaction Pipelines

This document details the primary runtime data flows, request lifecycles, and event-driven pipelines in **TeachView Live**. Each flow is mapped directly to its underlying source files and includes a Mermaid sequence diagram.

---

## 1. Meeting Creation & Host Initialization Flow

The host (instructor/admin) creates a monitored coding session, configures custom entry fields, and initializes the real-time monitoring room.

### Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    actor Host as Instructor / Host
    participant UI as Host Frontend (/meeting/host)
    participant API as POST /api/meeting/create
    participant Auth as getUserFromRequest (JWT)
    participant DB as MongoDB (Meeting Collection)
    participant Socket as Socket.IO Server (:3001/:4000)

    Host->>UI: Fills meeting title, dynamic custom fields (e.g. Roll No, Section)
    Host->>UI: Clicks "Create Meeting"
    UI->>API: POST /api/meeting/create { title, customFields, settings }
    API->>Auth: Verify Bearer JWT from Authorization header
    Auth-->>API: Validated Host User ID & Role
    API->>DB: Meeting.create({ hostId, title, customFields, code, status: "ACTIVE" })
    DB-->>API: Meeting Document with generated _id / code
    API-->>UI: 201 Created { meetingId, code, customFields }
    UI->>UI: Redirects to /meeting/host/[id]
    UI->>Socket: Connect & emit "join-room" { roomId: meetingId, role: "teacher", userId }
    Socket->>Socket: Add socket to room `meeting_${id}`
    Socket-->>UI: emit "room-joined" { roomId, participants: [] }
    UI->>UI: Initialize Admin Dashboard & Redux meetingSlice
```

### Source File Trace
- **Host Form**: [`app/meeting/host/create/page.jsx`](file:///c:/Users/AmanNagar/teachview-live/app/meeting/host/create/page.jsx)
- **Meeting Creation Handler**: [`app/api/meeting/create/route.js`](file:///c:/Users/AmanNagar/teachview-live/app/api/meeting/create/route.js)
- **Token Verification**: [`lib/getUserFromRequest.js`](file:///c:/Users/AmanNagar/teachview-live/lib/getUserFromRequest.js)
- **Meeting Schema**: [`models/Meeting.js`](file:///c:/Users/AmanNagar/teachview-live/models/Meeting.js)
- **Host Live Dashboard**: [`app/meeting/host/[id]/page.jsx`](file:///c:/Users/AmanNagar/teachview-live/app/meeting/host/%5Bid%5D/page.jsx)
- **Socket Client Service**: [`lib/socketService.ts`](file:///c:/Users/AmanNagar/teachview-live/lib/socketService.ts)

---

## 2. Student Discovery & Join Request Flow

Students enter via a shared meeting link, complete custom dynamic fields configured by the host, and join the session room.

### Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    actor Student as Student / Member
    participant UI as Student Frontend (/meeting/member/[id])
    participant API as GET /api/meeting/getDetails/[id]
    participant Redux as joinMeetingSlice
    participant Socket as Socket.IO Server
    participant HostUI as Host Dashboard (/meeting/host/[id])

    Student->>UI: Navigates to /meeting/member/[id]
    UI->>API: GET /api/meeting/getDetails/[id]
    API-->>UI: 200 OK { title, hostName, customFields: [{ name: "rollNumber", type: "text", required: true }] }
    UI->>UI: Render Dynamic Form based on customFields schema
    Student->>UI: Enters name and custom field responses
    Student->>UI: Clicks "Join Meeting"
    UI->>Redux: dispatch(setStudentDetails({ name, customResponses }))
    UI->>Socket: emit "join-meeting" { roomId, studentName, customResponses, socketId }
    Socket->>Socket: Add socket to room `meeting_${id}`
    Socket->>HostUI: emit "user-joined" { userId: socket.id, name, customResponses }
    HostUI->>HostUI: Update Redux participants.byId & participants.allIds
    Socket-->>UI: emit "joined-success" { roomId, sessionConfig }
    UI->>UI: Mounts Monaco Editor and Telemetry Engine
```

### Source File Trace
- **Student Join Page**: [`app/meeting/member/[id]/page.jsx`](file:///c:/Users/AmanNagar/teachview-live/app/meeting/member/%5Bid%5D/page.jsx)
- **Meeting Info API**: [`app/api/meeting/getDetails/[id]/route.js`](file:///c:/Users/AmanNagar/teachview-live/app/api/meeting/getDetails/%5Bid%5D/route.js)
- **Join State Store**: [`store/joinMeetingSlice.js`](file:///c:/Users/AmanNagar/teachview-live/store/joinMeetingSlice.js)
- **Meeting Store (Host Side)**: [`store/meetingSlice.ts`](file:///c:/Users/AmanNagar/teachview-live/store/meetingSlice.ts)

---

## 3. Real-Time Telemetry & AI Snapshot Pipeline

The core integrity pipeline monitors student activity in Monaco Editor without causing React re-renders, aggregates telemetry metrics, passes snapshots to Google Gemini / heuristic evaluator, and broadcasts integrity summaries to the instructor.

### Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    actor Student as Student
    participant Monaco as Monaco Editor DOM
    participant Hook as useStudentTracking.js (useRef)
    participant SnapAPI as POST /api/meeting/snapShot
    participant AI as sessionSummary.js (Gemini / Heuristics)
    participant Socket as Socket.IO Server
    participant HostUI as UserCard.jsx (Host Dashboard)

    Note over Monaco,Hook: Continuous Low-Overhead Tracking (Zero Re-renders)
    Student->>Monaco: Types code (onDidChangeModelContent)
    Monaco->>Hook: Increments characterCount & tracks typing cadence
    Student->>Monaco: Pastes external snippet (Clipboard Event)
    Monaco->>Hook: Increments pasteCount, sets isPaste = true
    Student->>Monaco: Switches browser tab / window blur
    Monaco->>Hook: Increments tabSwitchCount, sets isTabSwitch = true
    Student->>Monaco: Runs code locally
    Monaco->>Hook: Increments executionCount

    Note over Hook,SnapAPI: Snapshot Interval Trigger (Every 2 Minutes)
    Hook->>Hook: onSnapshot() timer callback fires
    Hook->>SnapAPI: POST /api/meeting/snapShot { code, language, characterCount, pasteCount, tabSwitchCount, executionCount, previousSummary }
    
    SnapAPI->>AI: generateSessionSummary(telemetryPayload)
    AI->>AI: Calculate heuristic penalty score (0-100)<br/>- Tab switch: -15pts each (max 45)<br/>- Large paste: -20pts each (max 40)<br/>- Blank code: -50pts
    alt Gemini API Key Available
        AI->>AI: Prompt Gemini with code diff & telemetry metrics
        AI-->>SnapAPI: Structured 5-point AI evaluation JSON
    else Gemini Offline or Key Missing
        AI->>AI: Generate rule-based fallback 5-point report
        AI-->>SnapAPI: Rule-based evaluation JSON
    end

    SnapAPI-->>Hook: 200 OK { summary, score, metrics }
    Hook->>Socket: emit "code-snapshot" { roomId, studentId, code, score, summary, metrics }
    Socket->>HostUI: broadcast to room: "receive-code-snapshot"
    HostUI->>HostUI: Update Redux state.participants.byId[id].snapshots
    HostUI->>HostUI: Re-render UserCard.jsx badge (Green / Yellow / Red), integrity score & AI summary
```

### Telemetry Pipeline Specifications
1. **Zero-Rerender Hook**: [`app/meeting/member/[id]/@right/user-code/UseStudentTracking.js`](file:///c:/Users/AmanNagar/teachview-live/app/meeting/member/%5Bid%5D/@right/user-code/UseStudentTracking.js) uses mutable `useRef` instances for all counters to prevent typing lag or re-render thrashing.
2. **Snapshot API Controller**: [`app/api/meeting/snapShot/route.js`](file:///c:/Users/AmanNagar/teachview-live/app/api/meeting/snapShot/route.js) enforces validation and coordinates score generation.
3. **Scoring & Prompt Utility**: [`utils/sessionSummary.js`](file:///c:/Users/AmanNagar/teachview-live/utils/sessionSummary.js) defines mathematical heuristics, fallback generators, and structured prompts.
4. **Host Card Component**: [`components/admin/UserCard.jsx`](file:///c:/Users/AmanNagar/teachview-live/components/admin/UserCard.jsx) renders the score meter, tab switch counter, paste warnings, and AI briefing modal.

---

## 4. Remote Code Execution Flow (Judge0 Integration)

Code submitted by students or teachers is executed in a sandboxed environment via the Judge0 API with Upstash rate limiting.

### Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    actor User as Student or Teacher
    participant UI as Code Editor Terminal Panel
    participant API as POST /api/run
    participant RateLimit as Upstash Redis (codeExecutionLimiter)
    participant Judge0 as Judge0 Engine (RapidAPI / CE)

    User->>UI: Clicks "Run Code"
    UI->>UI: Set execution status = "running"
    UI->>API: POST /api/run { language_id: 63, source_code: "console.log('hi')", stdin: "" }
    
    API->>RateLimit: Check sliding window rate limit
    alt Rate limit exceeded (>10 req / min)
        RateLimit-->>API: Limit exceeded
        API-->>UI: 429 Too Many Requests { message: "Rate limit exceeded. Try again in 60s" }
        UI->>UI: Render error toast
    else Rate limit permitted
        RateLimit-->>API: OK
        API->>Judge0: POST /submissions?base64_encoded=false&wait=true
        Note over API,Judge0: Sends X-RapidAPI-Key & X-RapidAPI-Host headers
        Judge0->>Judge0: Sandboxed execution (CPU / Memory limits applied)
        Judge0-->>API: 200 OK { stdout, stderr, compile_output, time, memory, status: { id: 3, description: "Accepted" } }
        API-->>UI: 200 OK { stdout, stderr, compile_output, time, memory, status }
        UI->>UI: Render stdout/stderr in output terminal
    end
```

### Source File Trace
- **Code Execution API**: [`app/api/run/route.js`](file:///c:/Users/AmanNagar/teachview-live/app/api/run/route.js)
- **Rate Limiting Guard**: [`lib/rateLimit.js`](file:///c:/Users/AmanNagar/teachview-live/lib/rateLimit.js) (`codeExecutionLimiter`)
- **Editor Output Component**: [`components/Terminal.jsx`](file:///c:/Users/AmanNagar/teachview-live/components/Terminal.jsx) / [`components/CodeEditor.jsx`](file:///c:/Users/AmanNagar/teachview-live/components/CodeEditor.jsx)

---

## 5. Authentication & Token Refresh Flow

The dual-token system uses short-lived (15-minute) Access JWTs and long-lived (7-day) Refresh Tokens stored in the database and an HTTP-only cookie.

### Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    actor User as Authenticated User
    participant Axios as lib/apiClient.js (Axios Interceptor)
    participant API as Protected API (/api/meeting/create)
    participant RefreshAPI as POST /api/login/refresh
    participant DB as MongoDB (RefreshToken Collection)

    User->>Axios: Dispatches API request
    Axios->>API: GET/POST with Bearer <Expired Access Token>
    API-->>Axios: 401 Unauthorized { message: "Token expired" }
    
    Note over Axios,RefreshAPI: Interceptor triggers automatic refresh
    Axios->>RefreshAPI: POST /api/login/refresh (Cookie: refreshToken=...)
    RefreshAPI->>DB: Find active refresh token matching hash
    
    alt Token valid & active
        DB-->>RefreshAPI: Token record found
        alt Token expiring within 24 hours
            RefreshAPI->>DB: Invalidate old token & create new rotated token
            RefreshAPI->>RefreshAPI: Set-Cookie: new refreshToken
        end
        RefreshAPI->>RefreshAPI: Generate new 15m Access JWT
        RefreshAPI-->>Axios: 200 OK { accessToken: "<New JWT>" }
        Axios->>Axios: Update Authorization header with new token
        Axios->>API: Re-execute original failed request with new token
        API-->>Axios: 200 OK Response data
        Axios-->>User: Resolved promise with response
    else Token revoked or expired
        DB-->>RefreshAPI: Token missing / revoked
        RefreshAPI-->>Axios: 401 Unauthorized { message: "Session expired" }
        Axios->>User: Clear auth state & redirect to /login
    end
```

### Source File Trace
- **HTTP Client Interceptor**: [`lib/apiClient.js`](file:///c:/Users/AmanNagar/teachview-live/lib/apiClient.js)
- **Token Refresh Handler**: [`app/api/login/refresh/route.js`](file:///c:/Users/AmanNagar/teachview-live/app/api/login/refresh/route.js)
- **Token Generator & Verifier**: [`lib/jwt.js`](file:///c:/Users/AmanNagar/teachview-live/lib/jwt.js)
- **Refresh Token Collection**: [`models/RefreshToken.js`](file:///c:/Users/AmanNagar/teachview-live/models/RefreshToken.js)

> [!WARNING]
> **Known Client-Side Bug**: In [`lib/apiClient.js`](file:///c:/Users/AmanNagar/teachview-live/lib/apiClient.js#L38-L43), the interceptor calls `/api/auth/jwt` to refresh tokens instead of the actual endpoint [`/api/login/refresh`](file:///c:/Users/AmanNagar/teachview-live/app/api/login/refresh/route.js). Refer to [`docs/deployment.md`](file:///c:/Users/AmanNagar/teachview-live/docs/deployment.md) for remediation details.
