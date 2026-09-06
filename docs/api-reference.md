# API Reference

All backend API endpoints are implemented using Next.js App Router Route Handlers located under [`app/api/`](file:///c:/Users/AmanNagar/teachview-live/app/api).

---

## 1. Authentication Endpoints

### 1.1 `POST /api/login`
- **File**: [`app/api/login/route.js`](file:///c:/Users/AmanNagar/teachview-live/app/api/login/route.js)
- **Rate Limit**: 5 requests / minute per client IP.
- **Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "SecurePassword123!"
  }
  ```
- **Responses**:
  - `200 OK`: Sets `refreshToken` HTTP-only cookie (`SameSite=lax; Path=/; Max-Age=604800`).
    ```json
    {
      "status": 200,
      "message": "Login successful",
      "accessToken": "eyJhbGciOi...",
      "user": {
        "id": "65f29d...",
        "name": "Alex",
        "email": "user@example.com"
      },
      "success": true
    }
    ```
  - `400 Bad Request`: `{ "status": 400, "message": "All fields are required", "success": false }`
  - `401 Unauthorized`: `{ "status": 401, "message": "Invalid email or password", "success": false }`
  - `404 Not Found`: `{ "status": 404, "message": "Invalid email or password" }`
  - `429 Too Many Requests`: `{ "success": false, "message": "Too many requests" }`

---

### 1.2 `POST /api/login/register`
- **File**: [`app/api/login/register/route.js`](file:///c:/Users/AmanNagar/teachview-live/app/api/login/register/route.js)
- **Rate Limit**: 5 requests / minute per client IP.
- **Request Body**:
  ```json
  {
    "name": "Alex Smith",
    "email": "alex@example.com",
    "password": "Password123!",
    "confirmPassword": "Password123!"
  }
  ```
- **Responses**:
  - `200 OK`:
    ```json
    {
      "status": 200,
      "data": null,
      "message": "We’ve sent a verification link to your email. Please verify to continue.",
      "success": true,
      "verifyUrl": "http://localhost:3000/login/register/VerifyEmail?token=a1b2c3..."
    }
    ```
  - `400 Bad Request`: `{ "status": 400, "message": "Invalid input", "success": false }`
  - `409 Conflict`: `{ "status": 409, "message": "Email already registered", "success": false }`
  - `429 Too Many Requests`: `{ "success": false, "message": "Too many requests" }`

---

### 1.3 `GET /api/login/verify-email`
- **File**: [`app/api/login/verify-email/route.js`](file:///c:/Users/AmanNagar/teachview-live/app/api/login/verify-email/route.js)
- **Query Parameters**: `token` (raw hex token string from email).
- **Responses**:
  - `200 OK`:
    ```json
    {
      "status": 200,
      "message": "Email verified. Please log in.",
      "success": true
    }
    ```
  - `400 Bad Request`: `{ "message": "Token expired or invalid" }` or `{ "message": "Invalid or missing token" }`

---

### 1.4 `POST /api/login/refresh`
- **File**: [`app/api/login/refresh/route.js`](file:///c:/Users/AmanNagar/teachview-live/app/api/login/refresh/route.js)
- **Cookie Required**: `refreshToken=<rawJwtToken>`
- **Responses**:
  - `200 OK`: Sets rotated `refreshToken` cookie if existing token is within 24h of expiration.
    ```json
    {
      "accessToken": "eyJhbGciOi..."
    }
    ```
  - `401 Unauthorized`: `{ "message": "Refresh token missing" }` or `{ "message": "Invalid refresh token" }` or `{ "message": "Refresh token expired or revoked" }`

---

### 1.5 `POST /api/login/logout`
- **File**: [`app/api/login/logout/route.js`](file:///c:/Users/AmanNagar/teachview-live/app/api/login/logout/route.js)
- **Responses**:
  - `200 OK`: Clears `refreshToken` cookie (`maxAge: 0`).
    ```json
    {
      "success": true,
      "message": "User logged out successfully",
      "status": 200
    }
    ```

---

### 1.6 `POST /api/login/forgotpassword/generateOTP`
- **File**: [`app/api/login/forgotpassword/generateOTP/route.js`](file:///c:/Users/AmanNagar/teachview-live/app/api/login/forgotpassword/generateOTP/route.js)
- **Rate Limit**: 5 requests / minute.
- **Request Body**:
  ```json
  {
    "email": "user@example.com"
  }
  ```
- **Responses**:
  - `200 OK`: `{ "status": 200, "message": "...", "success": true }`
  - `404 Not Found`: `{ "success": false, "message": "Email does not exist" }`

---

### 1.7 `POST /api/login/forgotpassword/verifyOTP`
- **File**: [`app/api/login/forgotpassword/verifyOTP/route.js`](file:///c:/Users/AmanNagar/teachview-live/app/api/login/forgotpassword/verifyOTP/route.js)
- **Rate Limit**: 5 requests / minute.
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "otp": ["1", "2", "3", "4", "5", "6"]
  }
  ```
- **Responses**:
  - `200 OK`:
    ```json
    {
      "success": true,
      "message": "OTP verified successfully",
      "resetToken": "550e8400-e29b-41d4-a716-446655440000"
    }
    ```
  - `400 Bad Request`: `{ "success": false, "message": "Invalid OTP" }` or `"OTP expired"`
  - `404 Not Found`: `{ "success": false, "message": "Write a valid Email" }`

---

### 1.8 `POST /api/login/forgotpassword/changepassword`
- **File**: [`app/api/login/forgotpassword/changepassword/route.js`](file:///c:/Users/AmanNagar/teachview-live/app/api/login/forgotpassword/changepassword/route.js)
- **Rate Limit**: 5 requests / minute.
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "NewSecurePassword123!",
    "resetToken": "550e8400-e29b-41d4-a716-446655440000"
  }
  ```
- **Responses**:
  - `200 OK`: `{ "success": true, "message": "Password updated successfully!" }`
  - `400 Bad Request`: `{ "success": false, "message": "Reset Token is invaild" }`

---

### 1.9 `GET /api/getUser`
- **File**: [`app/api/getUser/route.js`](file:///c:/Users/AmanNagar/teachview-live/app/api/getUser/route.js)
- **Headers Required**: `Authorization: Bearer <accessToken>`
- **Responses**:
  - `200 OK`:
    ```json
    {
      "user": {
        "_id": "65f2...",
        "name": "Alex Smith",
        "email": "alex@example.com",
        "provider": "credential",
        "meetingHistory": [],
        "hostedMeeting": []
      }
    }
    ```
  - `401 Unauthorized`: `{ "message": "Unauthorized" }`

---

## 2. Meeting Management Endpoints

### 2.1 `POST /api/createmeeting`
- **File**: [`app/api/createmeeting/route.js`](file:///c:/Users/AmanNagar/teachview-live/app/api/createmeeting/route.js)
- **Headers Required**: `Authorization: Bearer <accessToken>`
- **Request Body**:
  ```json
  {
    "name": "Algorithms Workshop",
    "url": "algorithms-workshop",
    "joinPolicy": "BOTH",
    "status": "live",
    "requiredFields": ["Student ID", "College Name"]
  }
  ```
- **Responses**:
  - `201 Created`:
    ```json
    {
      "message": "Meeting created successfully",
      "meeting": {
        "_id": "664c8f...",
        "name": "Algorithms Workshop",
        "url": "algorithms-workshop-aB3kL9mZ",
        "admin": "65f2...",
        "adminName": "Alex Smith",
        "joinPolicy": "BOTH",
        "status": "live",
        "members": ["65f2..."],
        "requiredFields": ["Student ID", "College Name"]
      },
      "socketAuth": "eyJhbGciOi...",
      "success": true
    }
    ```
  - `400 Bad Request`: `{ "error": "Name is required" }`
  - `401 Unauthorized`: `{ "error": "Unauthorized", "message": "User not authenticated" }`

---

### 2.2 `POST /api/getmeeting`
- **File**: [`app/api/getmeeting/route.js`](file:///c:/Users/AmanNagar/teachview-live/app/api/getmeeting/route.js)
- **Request Body**:
  ```json
  {
    "meetingId": "664c8f..."
  }
  ```
- **Responses**:
  - `200 OK`:
    ```json
    {
      "meeting": { "_id": "664c8f...", "name": "Algorithms Workshop", "url": "..." },
      "members": [{ "_id": "65f2...", "name": "Alex", "email": "alex@example.com" }]
    }
    ```
  - `404 Not Found`: `{ "error": "Meeting not found" }`

---

### 2.3 `POST /api/joinmeeting`
- **File**: [`app/api/joinmeeting/route.js`](file:///c:/Users/AmanNagar/teachview-live/app/api/joinmeeting/route.js)
- **Headers Required**: `Authorization: Bearer <accessToken>`
- **Request Body**:
  ```json
  {
    "meetingId": "664c8f...",
    "password": "",
    "formData": {
      "Student ID": "0832CS211005",
      "College Name": "LNCT"
    }
  }
  ```
- **Responses**:
  - `200 OK`:
    ```json
    {
      "success": true,
      "socketAuth": "eyJhbGciOi...",
      "message": "User added to meeting",
      "status": 200,
      "meetingUrl": "/meeting/member/algorithms-workshop-aB3kL9mZ"
    }
    ```
  - `404 Not Found`: `{ "success": false, "message": "Meeting not found", "status": 404 }`

---

### 2.4 `POST /api/meeting/getCurrentMeeting`
- **File**: [`app/api/meeting/getCurrentMeeting/route.js`](file:///c:/Users/AmanNagar/teachview-live/app/api/meeting/getCurrentMeeting/route.js)
- **Request Body**:
  ```json
  {
    "query": "algorithms"
  }
  ```
- **Responses**:
  - `200 OK`:
    ```json
    {
      "success": true,
      "message": "Meetings fetched successfully",
      "result": [
        {
          "_id": "664c...",
          "name": "Algorithms Workshop",
          "url": "algorithms-workshop-aB3kL9mZ",
          "status": "live",
          "joinPolicy": "BOTH",
          "members": ["65f2...", "65f3..."]
        }
      ]
    }
    ```
  - `400 Bad Request`: `{ "success": false, "message": "Search query is required", "result": [] }`

---

## 3. Telemetry & Execution Endpoints

### 3.1 `POST /api/meeting/snapShot`
- **File**: [`app/api/meeting/snapShot/route.js`](file:///c:/Users/AmanNagar/teachview-live/app/api/meeting/snapShot/route.js)
- **Request Body**: Student telemetry session summary generated from [`UseStudentTracking.js`](file:///c:/Users/AmanNagar/teachview-live/app/meeting/member/%5Bid%5D/@right/user-code/UseStudentTracking.js):
  ```json
  {
    "studentId": "65f2...",
    "studentName": "Riya",
    "assignmentId": "dsa-tree-01",
    "sessionDurationMs": 240000,
    "keystrokes": 184,
    "backspaces": 12,
    "backspaceRatio": "0.07",
    "pasteEvents": [],
    "runAttempts": 3,
    "totalErrors": 1,
    "flags": [],
    "code": "function invertTree(root) { ... }",
    "latestOutput": "Tree successfully inverted"
  }
  ```
- **Responses**:
  - `200 OK`:
    ```json
    {
      "ok": true,
      "snapshot": {
        "studentId": "65f2...",
        "studentName": "Riya",
        "assignmentId": "dsa-tree-01",
        "status": "coding",
        "label": "on-track",
        "contextLines": "Session duration: 4 minutes\nKeystrokes: 184...",
        "score": 68,
        "summary": {
          "whatStudentDid": "The student wrote a partial solution...",
          "struggling": "The student appears to be struggling...",
          "doingWell": "The student is actively coding...",
          "suspiciousBehavior": null,
          "adviceForTeacher": "Check whether the student understands..."
        },
        "generatedAt": "2026-09-06T13:30:00.000Z"
      }
    }
    ```

---

### 3.2 `POST /api/run`
- **File**: [`app/api/run/route.js`](file:///c:/Users/AmanNagar/teachview-live/app/api/run/route.js)
- **Request Body**:
  ```json
  {
    "code": "console.log('Hello World');",
    "language_id": 63,
    "input": ""
  }
  ```
- **Responses**:
  - `200 OK` (Forwarded directly from Judge0 CE):
    ```json
    {
      "stdout": "Hello World\n",
      "time": "0.032",
      "memory": 10240,
      "stderr": null,
      "token": "77a8b...",
      "compile_output": null,
      "message": null,
      "status": {
        "id": 3,
        "description": "Accepted"
      }
    }
    ```
