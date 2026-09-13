import express from "express";
import http from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
// import { connectDB } from "../lib/db.js";
// import Meeting from "../models/Meeting.js";
// import User from "../models/User.model.js";

const app = express();
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3000" , process.env.CLIENT_URL],
    credentials: true,
  },
});

// AUTH MIDDLEWARE
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  console.log("Authenticating socket with token:", token);
  if (!token) return next(new Error("No token"));

  try {
    const decoded = jwt.verify(token, process.env.SOCKET_JWT_SECRET || "");
    if (!decoded) {
      console.log("❌ Invalid token");
      return next(new Error("Invalid token"));
    }
    console.log("Socket authenticated for user ID:", decoded);
    socket.data.userId = decoded.id;
    socket.data.username = decoded.username;
    socket.data.isHost = decoded.isHost;
    socket.data.role = decoded.role;
    socket.data.meetingId = decoded.meetingId;
    next();
  } catch (e) {
    console.log("❌ Token verification error:", e);
    next(new Error(e.message));
  }
});

// CONNECTION
io.on("connection", (socket) => {
  console.log("User connected:", socket.data.userId);

  socket.on("join-meeting", async ({ meetingId }, ack) => {

    socket.join(meetingId);
    socket.to(meetingId).emit("user-joined", socket.data.userId);
    console.log(`User ${socket.data.userId} joined meeting ${meetingId}`);

    if (typeof ack === "function") {
      ack({ ok: true });
    }
  });

  socket.on("send-message", ({ text, meetingId }) => {
    console.log(`Message in : ${text}`);

    io.to(meetingId).emit("receive-message", {
      text,
      from: socket.data.username,
    });
  });

  socket.on("send-code", ({ code, meetingId }) => {
    console.log(`Code update in : ${code} from ${socket.data.username} and meetingId: ${meetingId}`);

    io.to(meetingId).emit("receive-code", {
      code,
      from: socket.data.username,
    });
  });

  socket.on("code-snapshot", ({ meetingId, snapshot }) => {
    console.log(`Code snapshot for meeting ${meetingId}:`, snapshot);
    io.to(meetingId).emit("receive-code-snapshot", { snapshot, from: socket.data.username });
  });

  // Request student code handler
  socket.on("request-student-code", ({ requestId, meetingId, studentId }) => {
    const userId = socket.data?.userId || socket.user?.id;
    if (!userId) {
      return socket.emit("student-code-error", {
        requestId,
        studentId,
        error: "UNAUTHORIZED",
        message: "You are not authenticated.",
      });
    }

    const isHost = socket.data?.isHost ?? socket.user?.isHost;
    const role = socket.data?.role ?? socket.user?.role;
    if (isHost === false || role === "student") {
      return socket.emit("student-code-error", {
        requestId,
        studentId,
        error: "FORBIDDEN",
        message: "Only teachers can request student code.",
      });
    }

    const tokenMeetingId = socket.data?.meetingId || socket.user?.meetingId;
    const tokenMeetingUrl = socket.data?.meetingUrl || socket.user?.meetingUrl;

    if (tokenMeetingId && tokenMeetingUrl) {
      const matches =
        String(tokenMeetingId) === String(meetingId) ||
        String(tokenMeetingUrl) === String(meetingId);
      if (!matches) {
        return socket.emit("student-code-error", {
          requestId,
          studentId,
          error: "FORBIDDEN",
          message: "You do not belong to this meeting.",
        });
      }
    }

    if (!socket.rooms.has(meetingId)) {
      socket.join(meetingId);
    }

    if (String(userId) === String(studentId)) {
      return socket.emit("student-code-error", {
        requestId,
        studentId,
        error: "INVALID_REQUEST",
        message: "Cannot request your own code as a student.",
      });
    }

    let targetSocket = null;
    const room = io.sockets.adapter.rooms.get(meetingId);

    if (room) {
      for (const socketId of room) {
        const s = io.sockets.sockets.get(socketId);
        const sUserId = s?.data?.userId || s?.user?.id;
        if (sUserId && String(sUserId) === String(studentId)) {
          targetSocket = s;
          break;
        }
      }
    }

    if (!targetSocket) {
      for (const [socketId, s] of io.sockets.sockets) {
        const sUserId = s?.data?.userId || s?.user?.id;
        if (sUserId && String(sUserId) === String(studentId)) {
          targetSocket = s;
          s.join(meetingId);
          break;
        }
      }
    }

    if (!targetSocket) {
      return socket.emit("student-code-error", {
        requestId,
        studentId,
        error: "STUDENT_OFFLINE",
        message: "Student is offline. We cannot connect to the student.",
      });
    }

    targetSocket.emit("get-current-code", {
      requestId,
      meetingId,
      teacherId: socket.data.userId,
    });
  });

  socket.on("student-code-response", ({ requestId, meetingId, code, language }) => {
    io.to(meetingId).emit("receive-student-code", {
      requestId,
      studentId: socket.data.userId,
      studentName: socket.data.username,
      code: typeof code === "string" ? code : "",
      language: language || "javascript",
      timestamp: Date.now(),
    });
  });


  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.data.userId);
  });

});

httpServer.listen(3001, () => {
  console.log("Socket server running on port 3001");
});
