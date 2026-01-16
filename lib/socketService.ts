import { io, Socket } from "socket.io-client";
import { store } from "@/store";
import {
  userJoined,
  userLeft,
  setConnectionStatus,
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

  socket.on("user-joined", (data) => {
    store.dispatch(userJoined(data.user));
  });

  socket.on("user-left", (data) => {
    store.dispatch(userLeft(data.userId));
  });

  return socket;
}

export function joinMeeting(meetingId: string) {
  socket?.emit("join-meeting", { meetingId });
}

export function disconnectSocket() {
  socket?.disconnect();
  socket = null;
}
