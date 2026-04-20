import { io, Socket } from "socket.io-client";
import { store } from "@/store";
import {
  userJoined,
  userLeft,
  setConnectionStatus,
  setParticipants,
  updateSnapshot
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


  return socket;
}

export function joinMeeting(meetingId: string) {
  socket?.emit("join-meeting", { meetingId });
}

export function sendCodeSnapshot(meetingId: string, snapshot: any) {
  console.log("Sending code snapshot for meeting", meetingId, ":", snapshot);
  socket?.emit("code-snapshot", { meetingId, snapshot });
}

export function disconnectSocket() {
  socket?.disconnect();
  socket = null;
}
