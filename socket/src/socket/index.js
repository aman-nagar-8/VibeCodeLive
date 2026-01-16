import { Server } from "socket.io";
import socketAuth from "./auth.middleware.js";
import registerMeetingHandlers from "./meeting.socket.js";

export default function initSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: [process.env.CLIENT_URL],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.use(socketAuth);
  console.log("middleware run");

  io.on("connection", (socket) => {
    console.log("🟢 Socket connected:", socket.id);

    // 🔹 Register meeting events
    registerMeetingHandlers({io, socket});

    socket.on("disconnect", (reason) => {
      console.log("🔴 Socket disconnected:", socket.id, reason);
    });
  });

  return io;
}
