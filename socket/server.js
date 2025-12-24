import express from "express";
import http from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { connectDB } from "../lib/db.js";
import Meeting from "../models/Meeting.js";
import User from "../models/User.model.js";

const app = express();
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3000"],
    credentials: true,
  },
});

// AUTH MIDDLEWARE
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  console.log("Authenticating socket with token:", token);
  if (!token) return next(new Error("No token"));

  try {
    const decoded = jwt.verify(token, "");
    if (!decoded) {
      console.log("❌ Invalid token");
      return next(new Error("Invalid token"));
    }
    console.log("Socket authenticated for user ID:", decoded);
    socket.data.userId = decoded.id;
    socket.data.username = decoded.username;
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
    await connectDB();
    // const meeting = await Meeting.findById(meetingId);

    // optional: check membership
    // const isMember = meeting.members.some(
    //   (m) => m.toString() === socket.data.userId.toString()
    // );

    // if (!meeting) {
    //   console.log("❌ Meeting not found:", meetingId);
    //   return ack({ ok: false, message: "Meeting not found" });
    // };

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

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.data.userId);
  });

});

httpServer.listen(3001, () => {
  console.log("Socket server running on port 3001");
});
