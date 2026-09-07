# Deployment Guide, Infrastructure & Technical Debt Catalog

This document provides complete instructions for deploying **TeachView Live** in production, environment configuration, process orchestration, and a comprehensive remediation catalog for verified technical debt.

---

## 1. Environment Variable Reference

Configure the following environment variables in `.env.local` (development) and production secret managers.

| Variable Name | Required | Default / Example | Purpose |
|---|---|---|---|
| `MONGODB_URI` | **Yes** | `mongodb+srv://.../teachview` | MongoDB Atlas cluster connection string |
| `JWT_SECRET` | **Yes** | `[cryptographic-hex-string]` | Secret key used to sign 15-minute Access JWTs |
| `REFRESH_TOKEN_SECRET`| **Yes** | `[cryptographic-hex-string]` | Secret key used to generate 7-day Refresh Tokens |
| `SOCKET_JWT_SECRET` | **Yes** | `[cryptographic-hex-string]` | Shared secret for Socket.IO connection authentication |
| `NEXTAUTH_SECRET` | **Yes** | `[cryptographic-hex-string]` | NextAuth session encryption key |
| `NEXTAUTH_URL` | **Yes** | `https://live.teachview.com` | Canonical root domain of the deployment |
| `GOOGLE_CLIENT_ID` | Optional | `[google-oauth-client-id]` | Google OAuth 2.0 Client ID for social login |
| `GOOGLE_CLIENT_SECRET`| Optional | `[google-oauth-secret]` | Google OAuth 2.0 Client Secret |
| `UPSTASH_REDIS_REST_URL`| **Yes** | `https://[id].upstash.io` | Upstash Redis REST endpoint for rate limiting |
| `UPSTASH_REDIS_REST_TOKEN`| **Yes** | `[upstash-rest-token]` | Access token for Upstash Redis |
| `RAPIDAPI_KEY` | **Yes** | `[rapidapi-api-key]` | API key for Judge0 code execution engine |
| `RAPIDAPI_HOST` | **Yes** | `judge0-ce.p.rapidapi.com` | Hostname header for Judge0 RapidAPI proxy |
| `GEMINI_API_KEY` | Optional | `AIzaSy...` | Google Gemini API key for AI telemetry summaries |
| `EMAIL_USER` | **Yes** | `alerts@teachview.com` | SMTP username / Gmail account for OTP emails |
| `EMAIL_PASS` | **Yes** | `[smtp-app-password]` | SMTP application password |
| `NEXT_PUBLIC_API_URL` | **Yes** | `https://live.teachview.com` | Base REST API URL accessed by client browsers |
| `NEXT_PUBLIC_SOCKET_URL`| **Yes** | `wss://socket.teachview.com` | WebSocket URL for real-time room communication |
| `PORT` | No | `3000` | HTTP port for Next.js web application |

---

## 2. Deployment Topology

TeachView Live requires a **dual-process runtime**:
1. **Next.js Web Server**: Serves SSR pages, static assets, and App Router API Route Handlers.
2. **Socket.IO Daemon**: Stateful WebSocket process managing persistent room subscriptions, real-time code updates, and telemetry broadcasting.

```mermaid
graph TD
    UserClient["Client Web Browser"]
    Nginx["NGINX Reverse Proxy (SSL / TLS Termination)"]
    
    subgraph "Application Host (VPS or Container)"
        NextServer["Next.js Web Process (:3000)"]
        SocketDaemon["Socket.IO Server Process (:3001 or :4000)"]
    end
    
    subgraph "External Cloud Services"
        MongoCloud[("MongoDB Atlas")]
        UpstashRedis[("Upstash Redis")]
        Judge0Cloud["Judge0 Execution API"]
        GeminiCloud["Google Gemini AI"]
        GoogleOAuth["Google Identity"]
    end

    UserClient -->|HTTPS (Port 443)| Nginx
    UserClient -->|WSS (Port 443 /socket.io)| Nginx
    
    Nginx -->|Proxy / and /api/*| NextServer
    Nginx -->|Proxy /socket.io/* (Upgrade: websocket)| SocketDaemon
    
    NextServer --> MongoCloud
    NextServer --> UpstashRedis
    NextServer --> Judge0Cloud
    NextServer --> GeminiCloud
    NextServer --> GoogleOAuth
    
    SocketDaemon --> MongoCloud
```

---

## 3. Production Deployment Guide (Ubuntu VPS & PM2)

### Step 1: Install Dependencies
Ensure Node.js 20 LTS and PM2 are installed:
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g pm2
```

### Step 2: Clone and Build Application
```bash
git clone https://github.com/aman-nagar-8/VibeCodeLive.git /var/www/teachview-live
cd /var/www/teachview-live
npm install
npm run build
```

### Step 3: Configure PM2 Ecosystem
Create an `ecosystem.config.js` file in the project root:

```javascript
module.exports = {
  apps: [
    {
      name: "teachview-web",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000",
      instances: "max",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "teachview-socket",
      script: "socket/server.js", // or "socket/src/index.js"
      instances: 1,               // Socket.IO requires single instance or Redis adapter
      env: {
        NODE_ENV: "production",
        PORT: 3001,
      },
    },
  ],
};
```

Launch the services:
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Step 4: Configure NGINX Reverse Proxy
Create `/etc/nginx/sites-available/teachview`:

```nginx
server {
    listen 80;
    server_name live.teachview.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name live.teachview.com;

    ssl_certificate /etc/letsencrypt/live/live.teachview.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/live.teachview.com/privkey.pem;

    # Next.js Web App & REST APIs
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Socket.IO WebSocket Route
    location /socket.io/ {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable the site and reload NGINX:
```bash
sudo ln -s /etc/nginx/sites-available/teachview /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 4. Verified Technical Debt & Remediation Catalog

The following issues were identified during the codebase audit. They must be resolved before high-scale production deployment.

### 1. Socket Server Duality & Empty Verification Key
- **Locations**: [`socket/server.js`](file:///c:/Users/AmanNagar/teachview-live/socket/server.js) vs [`socket/src/index.js`](file:///c:/Users/AmanNagar/teachview-live/socket/src/index.js)
- **Problem**:
  - `socket/server.js` listens on port `3001` and contains `jwt.verify(token, "")` with an empty secret string, compromising token security.
  - `socket/src/index.js` listens on port `4000` and correctly uses `process.env.SOCKET_JWT_SECRET`, but is not imported by `package.json` startup scripts.
- **Remediation**:
  - Deprecate `socket/server.js`.
  - Update `package.json` script `"socket"` to point to `socket/src/index.js`.
  - Ensure client connection URL points to port 4000 or the unified reverse proxy route.

---

### 2. Axios Interceptor Refresh Route Mismatch
- **Location**: [`lib/apiClient.js`](file:///c:/Users/AmanNagar/teachview-live/lib/apiClient.js#L38-L43)
- **Problem**:
  The interceptor attempts to refresh expired tokens via:
  ```javascript
  const res = await axios.post("/api/auth/jwt", {}, { withCredentials: true });
  ```
  There is no route handler at `/api/auth/jwt`. The actual refresh endpoint is [`app/api/login/refresh/route.js`](file:///c:/Users/AmanNagar/teachview-live/app/api/login/refresh/route.js).
- **Remediation**:
  Update the URL in `lib/apiClient.js`:
  ```javascript
  const res = await axios.post("/api/login/refresh", {}, { withCredentials: true });
  ```

---

### 3. Redux Array Filter Shadowing Bug
- **Location**: [`store/meetingSlice.ts`](file:///c:/Users/AmanNagar/teachview-live/store/meetingSlice.ts#L67-L69)
- **Problem**:
  In the `removeParticipant` reducer:
  ```typescript
  state.participants.allIds = state.participants.allIds.filter((id) => id !== id);
  ```
  The parameter `id` shadows the scope variable, so `id !== id` is always `false`, which deletes **all** participant IDs whenever any individual student disconnects.
- **Remediation**:
  Modify to compare against the action payload:
  ```typescript
  removeParticipant: (state, action: PayloadAction<string>) => {
    delete state.participants.byId[action.payload];
    state.participants.allIds = state.participants.allIds.filter((id) => id !== action.payload);
  }
  ```

---

### 4. React Hook Rule Violation in Members List
- **Location**: [`app/meeting/member/[id]/@right/members/page.js`](file:///c:/Users/AmanNagar/teachview-live/app/meeting/member/%5Bid%5D/@right/members/page.js#L16-L18)
- **Problem**:
  `useSelector` is invoked inside an array `.map()` callback:
  ```javascript
  {participants.map((id) => {
    const user = useSelector((state) => state.meeting.participants.byId[id]);
    return <MemberCard key={id} user={user} />;
  })}
  ```
  Calling hooks inside callbacks violates the Rules of Hooks and causes runtime exceptions.
- **Remediation**:
  Extract `MemberCard` into a standalone component that calls `useSelector`, or select the entire `byId` dictionary once at the parent level.

---

### 5. Intentional Slot Inversion in Layout
- **Location**: [`app/meeting/member/[id]/layout.tsx`](file:///c:/Users/AmanNagar/teachview-live/app/meeting/member/%5Bid%5D/layout.tsx#L33)
- **Status**: Verified intentional design choice.
- **Detail**: The parallel slots are rendered as `<Base left={right} right={left} />` to place the code editor on the left main panel and chat/members on the right sidebar. Developers should be aware of this mapping when editing slot files.
