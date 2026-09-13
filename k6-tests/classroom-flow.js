import http from "k6/http";
import { check, sleep } from "k6";
import { Trend, Counter } from "k6/metrics";
import { io } from "k6/x/socketio";

const users = JSON.parse(open("./users.json"));

export const options = {
  vus: 1,
  duration: "5s",
};

const BASE_URL = "http://localhost:3000";
const MEETING_NAME = "test-meeting";
const WS_URL = "http://localhost:4000"


const snapshotRoundTrip = new Trend("snapshot_round_trip_ms");
const socketConnections = new Counter("socket_connections");
const socketErrors = new Counter("socket_errors");
const snapshotsReceived = new Counter("snapshots_received");

export default function () {
  // 1. Select this VU's student
  const user = users[__VU - 1];

  // 2. Login
  const authToken = login(user);

  // 3. Search for a meeting
  const meetingResponse = searchMeeting(authToken);
  const meetingId = meetingResponse._id;

  // 4. Join the meeting
  const { socketAuth, meetingUrl } = joinMeeting(authToken, meetingResponse);

  // 5. Connect to the meeting via WebSocket
  connectSocket(socketAuth, meetingId);
}

function login(user) {
  const url = `${BASE_URL}/api/login`;

  const payload = JSON.stringify({
    email: user.email,
    password: user.password,
  });

  const response = http.post(url, payload, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  check(response, {
    "login status is 200": (r) => r.status === 200,
  });

  return response.json("accessToken");
}

function searchMeeting(authToken) {
  const url = `${BASE_URL}/api/meeting/getCurrentMeeting`;
  const payload = JSON.stringify({
    query: MEETING_NAME,
  });

  const response = http.post(url, payload, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  check(response, {
    "meeting search successful": (r) => r.status === 200,
  });

  const data = response.json();

  if (!data.result || data.result.length === 0) {
    throw new Error("No meetings found");
  }

  return data.result[0];
}

function joinMeeting(authToken, meeting) {
  const url = `${BASE_URL}/api/joinmeeting`;
  const payload = JSON.stringify({
    meetingId: meeting._id,
  });

  const response = http.post(
    url,
    payload,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    }
  );

  check(response, {
    "meeting join successful": (r) => r.status === 200,
  });

  const data = response.json();

  return {
    socketAuth: data.socketAuth,
    meetingUrl: data.meetingUrl
  };
}

function connectSocket(socketAuth , meetingId) {
    const socket = io(WS_URL, {
    path: "/socket.io/",
    namespace: "/",
    auth: {
      token: socketAuth,
    },
  });

  socket.on("connect", () => {
    socketConnections.add(1);

    console.log(
      `VU ${__VU} Socket.IO connected`
    );

    // ------------------------------------------------
    // 5. JOIN SOCKET.IO ROOM
    // ------------------------------------------------

    socket.emit("join-meeting", {
      meetingId,
    });

    console.log(
      `VU ${__VU} emitted join-meeting`
    );
  });

  socket.on("connect_error", (error) => {
    socketErrors.add(1);

    console.error(
      `VU ${__VU} socket connection error:`,
      error
    );
  });

  socket.on("meeting-members", (members) => {
    console.log(
      `VU ${__VU} received ${members.length} meeting members`
    );
  });

  socket.on("user-joined", (data) => {
    console.log(
      `VU ${__VU} saw user join:`,
      JSON.stringify(data)
    );
  });

  socket.on("user-left", (data) => {
    console.log(
      `VU ${__VU} saw user leave:`,
      JSON.stringify(data)
    );
  });

    // --------------------------------------------------
  // 6. RECEIVE SNAPSHOT
  // --------------------------------------------------

  socket.on(
    "receive-code-snapshot",
    (data) => {
      snapshotsReceived.add(1);

      const receivedAt = Date.now();

      if (data.clientTimestamp) {
        const latency =
          receivedAt - data.clientTimestamp;

        snapshotRoundTrip.add(latency);
      }

      console.log(
        `VU ${__VU} received snapshot from ${data.from}`
      );
    }
  );

  // --------------------------------------------------
  // 7. SEND CODE SNAPSHOT
  // --------------------------------------------------

  socket.emit("code-snapshot", {
    meetingId,
    snapshot: {
      code: `// Load test from VU ${__VU}`,
      language: "javascript",
      clientTimestamp: Date.now(),
    },
  });

  console.log(
    `VU ${__VU} sent code snapshot`
  );

  // Keep connection alive.
  sleep(10);

  // --------------------------------------------------
  // 8. DISCONNECT
  // --------------------------------------------------

  socket.disconnect();

  console.log(
    `VU ${__VU} disconnected`
  );
}


