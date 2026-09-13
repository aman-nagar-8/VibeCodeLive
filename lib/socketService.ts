import { io, Socket } from "socket.io-client";
import { store } from "@/store";
import {
  userJoined,
  userLeft,
  setConnectionStatus,
  setParticipants,
  updateSnapshot,
  receiveStudentCodeSuccess,
  receiveStudentCodeError,
} from "@/store/meetingSlice";

let socket: Socket | null = null;

export function connectSocket(token: string) {
  if (socket) return socket; // prevent duplicate connections

  socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
    transports: ["websocket"],
    auth: { token },
  });

  socket.on("connect", () => {
    store.dispatch(setConnectionStatus("connected"));
  });

  socket.on("disconnect", () => {
    store.dispatch(setConnectionStatus("disconnected"));
  });

  socket.on("meeting-members", (members) => {
    console.log("Received meeting members:", members);
    store.dispatch(setParticipants(members));
  });

  socket.on("user-joined", (data) => {
    store.dispatch(userJoined(data.user));
  });

  socket.on("user-left", (data) => {
    store.dispatch(userLeft(data.userId));
  });

  socket.on("receive-code-snapshot", ({ snapshot, from }) => {
    console.log("Received code snapshot from user", from, ":", snapshot);
    store.dispatch(updateSnapshot({ userId: from, snapshot }));
  });

  socket.on("receive-student-code", ({ requestId, studentId, studentName, code, language, timestamp }) => {
    console.log("Received student code snapshot:", studentId, requestId);
    store.dispatch(
      receiveStudentCodeSuccess({
        studentId,
        studentName,
        code,
        language,
        timestamp,
      })
    );
  });

  socket.on("student-code-error", ({ requestId, studentId, error, message }) => {
    console.warn("Student code error:", studentId, error, message);
    store.dispatch(
      receiveStudentCodeError({
        studentId,
        error: message || error || "Failed to retrieve student code.",
      })
    );
  });

  return socket;
}

export function joinMeeting(meetingId: string) {
  socket?.emit("join-meeting", { meetingId });
}

export function sendCodeSnapshot(meetingId: string, snapshot: any) {
  console.log("Sending code snapshot for meeting", meetingId, ":", snapshot);
  socket?.emit("code-snapshot", { meetingId, snapshot });
}

export function requestStudentCode(meetingId: string, studentId: string, requestId: string) {
  console.log("Requesting student code:", { meetingId, studentId, requestId });
  socket?.emit("request-student-code", { requestId, meetingId, studentId });
}

export function sendStudentCodeResponse(payload: {
  requestId: string;
  meetingId: string;
  code: string;
  language: string;
}) {
  console.log("Sending student code response for request:", payload.requestId);
  socket?.emit("student-code-response", payload);
}

export function onGetStudentCode(
  callback: (data: { requestId: string; meetingId: string; teacherId?: string }) => void
) {
  socket?.on("get-current-code", callback);
  return () => {
    socket?.off("get-current-code", callback);
  };
}

export function getSocketInstance(): Socket | null {
  return socket;
}

export function disconnectSocket() {
  socket?.disconnect();
  socket = null;
}
