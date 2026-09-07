# Authentication & Authorization Architecture

VibeCodeLive employs a hardened authentication system combining **Dual-Token JWTs with Token Rotation**, **Staged Email Verification**, **Rate-Limited OTP Password Recovery**, and **Google OAuth 2.0 via NextAuth**.

---

## 1. Dual-Token JWT Architecture

### 1.1 Token Specifications

| Attribute | Access Token | Refresh Token |
|---|---|---|
| **Lifespan** | 15 minutes (`15m`) | 7 days (`7d`) |
| **Signing Secret** | `process.env.ACCESS_TOKEN_SECRET` | `process.env.REFRESH_TOKEN_SECRET` |
| **Payload** | `{ userId: user._id, email: user.email }` | `{ userId: user._id }` |
| **Client Storage** | In-Memory (JavaScript variable in [`lib/apiClient.js`](file:///c:/Users/AmanNagar/teachview-live/lib/apiClient.js)) | HTTP-Only Secure Cookie (`refreshToken`) |
| **Server Storage** | Stateless (not in DB) | SHA-256 Hashed in MongoDB ([`models/RefreshToken.js`](file:///c:/Users/AmanNagar/teachview-live/models/RefreshToken.js)) |
| **Generator** | [`generateAccessToken(user)`](file:///c:/Users/AmanNagar/teachview-live/lib/tokens.js#L3) | [`generateRefreshToken(user)`](file:///c:/Users/AmanNagar/teachview-live/lib/tokens.js#L16) |

---

## 2. Refresh Token Rotation Lifecycle

When a client hits an expired access token, the client transparently requests a new one. The server validates the refresh token and automatically **rotates** it if it is within 24 hours of expiration.

```mermaid
sequenceDiagram
    autonumber
    actor Client as Browser / Axios
    participant Route as POST /api/login/refresh
    participant DB as MongoDB (RefreshToken)
    participant UserDB as MongoDB (User)

    Client->>Route: POST /api/login/refresh (Cookie: refreshToken)
    Route->>Route: Extract refreshToken from request cookies
    alt No Cookie Present
        Route-->>Client: 401 { message: "Refresh token missing" }
    end

    Route->>Route: jwt.verify(refreshToken, REFRESH_TOKEN_SECRET)
    alt Invalid Signature or Expired JWT
        Route-->>Client: 401 { message: "Invalid refresh token" }
    end

    Route->>Route: tokenHash = hashToken(refreshToken) (SHA-256)
    Route->>DB: RefreshToken.findOne({ tokenHash })
    alt Token Hash Not Found
        Route-->>Client: 401 { message: "Refresh token expired or revoked" }
    end

    Route->>UserDB: User.findById(storedToken.userId)
    Route->>Route: newAccessToken = generateAccessToken(user)

    Note over Route,DB: Rotation Check (Threshold = 24 Hours)
    alt (storedToken.expiresAt - now) < 24 Hours
        Route->>DB: RefreshToken.deleteOne({ tokenHash })
        Route->>Route: newRefreshToken = generateRefreshToken(user)
        Route->>DB: RefreshToken.create({ userId, tokenHash: hash(newRefreshToken), expiresAt: now + 7d })
        Route->>Client: Set-Cookie: refreshToken=newRefreshToken; HttpOnly; SameSite=lax; Path=/
    end

    Route-->>Client: 200 { accessToken: newAccessToken }
```

---

## 3. Registration & Staged Email Verification Flow

To prevent unverified accounts from cluttering the primary collection, users are initially staged in [`models/EmailVerification.js`](file:///c:/Users/AmanNagar/teachview-live/models/EmailVerification.js). Once the email token is verified, the document is migrated to [`models/User.model.js`](file:///c:/Users/AmanNagar/teachview-live/models/User.model.js).

```mermaid
sequenceDiagram
    autonumber
    actor User as User Browser
    participant RegAPI as POST /api/login/register
    participant VerifyAPI as GET /api/login/verify-email
    participant StageDB as MongoDB (EmailVerification)
    participant UserDB as MongoDB (User)

    User->>RegAPI: POST { name, email, password, confirmPassword }
    RegAPI->>RegAPI: Rate limit check (Upstash: max 5 req/min)
    RegAPI->>RegAPI: Zod validate against registerSchema
    RegAPI->>UserDB: User.findOne({ email })
    alt User Already Exists
        RegAPI-->>User: 409 { message: "Email already registered" }
    end

    RegAPI->>RegAPI: bcrypt.hash(password, 10)
    RegAPI->>RegAPI: rawToken = crypto.randomBytes(32).toString("hex")
    RegAPI->>RegAPI: hashedToken = sha256(rawToken)
    RegAPI->>StageDB: EmailVerification.create({ name, email, password: hashedPwd, verificationToken: hashedToken, tokenExpiry: now + 15m })
    RegAPI->>RegAPI: Build verifyUrl = APP_URL/login/register/VerifyEmail?token=rawToken
    RegAPI-->>User: 200 { message: "...", verifyUrl }

    Note over User,VerifyAPI: User Clicks Verification Link in Email
    User->>VerifyAPI: GET /api/login/verify-email?token=rawToken
    VerifyAPI->>StageDB: cleanupExpiredEmailVerifications() (Delete tokenExpiry < now)
    VerifyAPI->>VerifyAPI: hashedToken = sha256(rawToken)
    VerifyAPI->>StageDB: EmailVerification.findOne({ verificationToken: hashedToken, tokenExpiry > now })
    alt Token Missing or Expired
        VerifyAPI-->>User: 400 { message: "Token expired or invalid" }
    end

    VerifyAPI->>UserDB: User.create({ name, email, password })
    VerifyAPI->>StageDB: EmailVerification.deleteOne({ _id })
    VerifyAPI-->>User: 200 { message: "Email verified. Please log in." }
```

---

## 4. Google OAuth via NextAuth

Defined in [`app/api/auth/[...nextauth]/route.ts`](file:///c:/Users/AmanNagar/teachview-live/app/api/auth/%5B...nextauth%5D/route.ts):

1. **`signIn` Callback**:
   - Checks if user exists by email in [`User`](file:///c:/Users/AmanNagar/teachview-live/models/User.model.js).
   - If missing, creates a new user document with `provider: "google"`.
2. **`jwt` Callback**:
   - Generates an application `accessToken` (15m) and `refreshToken` (7d).
   - Hashes the refresh token and inserts a record in [`models/RefreshToken.js`](file:///c:/Users/AmanNagar/teachview-live/models/RefreshToken.js).
   - Sets the HTTP-only `refreshToken` cookie on the client response:
     ```typescript
     cookiesList.set("refreshToken", refreshToken, {
       httpOnly: true,
       secure: true,
       sameSite: "lax",
       path: "/",
       maxAge: 60 * 60 * 24 * 7,
     });
     ```
   - Appends `accessToken` and `userId` to the NextAuth JWT token object.
3. **`session` Callback**:
   - Exposes `accessToken` and `user.id` on the client-side NextAuth `session` object.

---

## 5. Password Recovery via 6-Digit OTP

Managed through a 4-step state machine in [`app/login/forget-password/Forms.jsx`](file:///c:/Users/AmanNagar/teachview-live/app/login/forget-password/Forms.jsx):

```mermaid
stateDiagram-v2
    [*] --> Step1_Email: Enter Email Address
    Step1_Email --> Step2_OTP: POST /api/login/forgotpassword/generateOTP
    note right of Step1_Email
      Generates 6-digit random code
      Hashes with SHA-256 into OTP collection
      Dispatches email with 10-min TTL
    end note

    Step2_OTP --> Step3_Password: POST /api/login/forgotpassword/verifyOTP
    note right of Step2_OTP
      Verifies SHA-256 hash match
      Issues unique UUID resetToken
      Stores resetToken in OTP record
    end note

    Step3_Password --> Step4_Success: POST /api/login/forgotpassword/changepassword
    note right of Step3_Password
      Validates resetToken & password complexity
      Updates User.password with bcrypt hash
      Deletes OTP document
    end note

    Step4_Success --> [*]: Redirects to /login after 3 seconds
```

---

## 6. Route & API Authorization Guard

Protected API routes verify authorization using [`lib/getUserFromRequest.js`](file:///c:/Users/AmanNagar/teachview-live/lib/getUserFromRequest.js):

```javascript
// Usage Example in API Route Handler:
import { getUserFromRequest } from "@/lib/getUserFromRequest";

export async function POST(req) {
  // Throws ApiError(401) if authorization header is absent or token is invalid/expired
  const decodedUser = getUserFromRequest(req);
  const userId = decodedUser.userId;
  // ... proceed with authenticated logic
}
```

The decoded JWT payload provides:
- `decodedUser.userId`: MongoDB ObjectId string for the user.
- `decodedUser.email`: Registered email string.
