export default function registerMeetingHandlers({ io, socket }) {
  socket.on("join-meeting", ({ meetingId }) => {
    socket.join(meetingId);
    console.log("user join meeting room");

    const room = io.sockets.adapter.rooms.get(meetingId);
    const members = [];

    if (room) {
      for (const socketId of room) {
        const s = io.sockets.sockets.get(socketId);
        if (s?.user) {
          members.push({
            id: s.user.id,
            username: s.user.username,
          });
        }
      }
    }
    socket.emit("meeting-members", members);

    console.log("user joined meeting room : ", socket.user);
    socket.to(meetingId).emit("user-joined", {
      user: socket.user,
      socketId: socket.id,
    });
  });
  socket.on("code-snapshot", ({ meetingId, snapshot }) => {
    io.to(meetingId).emit("receive-code-snapshot", { snapshot, from: socket.user.id });
  });

  // 🔹 Request Student Code (Teacher -> Student via Server)
  socket.on("request-student-code", ({ requestId, meetingId, studentId }) => {
    console.log(`Teacher ${socket.user?.id} requesting code of student ${studentId} in meeting ${meetingId}`);

    // Authorization checks:
    // 1. Authenticated socket
    if (!socket.user) {
      return socket.emit("student-code-error", {
        requestId,
        studentId,
        error: "UNAUTHORIZED",
        message: "You are not authenticated.",
      });
    }

    // 2. Teacher privileges: reject if explicitly marked as student
    if (socket.user.isHost === false || socket.user.role === "student") {
      return socket.emit("student-code-error", {
        requestId,
        studentId,
        error: "FORBIDDEN",
        message: "Only teachers can request student code.",
      });
    }

    // 3. Belongs to this meeting:
    // If token has both meetingId and meetingUrl, verify at least one matches meetingId
    if (socket.user.meetingId && socket.user.meetingUrl) {
      const matches =
        String(socket.user.meetingId) === String(meetingId) ||
        String(socket.user.meetingUrl) === String(meetingId);
      if (!matches) {
        return socket.emit("student-code-error", {
          requestId,
          studentId,
          error: "FORBIDDEN",
          message: "You do not belong to this meeting.",
        });
      }
    }

    // Ensure teacher socket is in the meeting room
    if (!socket.rooms.has(meetingId)) {
      socket.join(meetingId);
    }

    // 4. Requested student must not be the teacher themselves
    if (String(socket.user.id) === String(studentId)) {
      return socket.emit("student-code-error", {
        requestId,
        studentId,
        error: "INVALID_REQUEST",
        message: "Cannot request your own code as a student.",
      });
    }

    // 5. Locate requested student (first check room, fallback to all connected sockets)
    let targetSocket = null;
    const room = io.sockets.adapter.rooms.get(meetingId);

    if (room) {
      for (const socketId of room) {
        const s = io.sockets.sockets.get(socketId);
        const sUserId = s?.user?.id || s?.data?.userId;
        if (sUserId && String(sUserId) === String(studentId)) {
          targetSocket = s;
          break;
        }
      }
    }

    // Fallback: search all sockets if student reconnected and lost room membership
    if (!targetSocket) {
      for (const [socketId, s] of io.sockets.sockets) {
        const sUserId = s?.user?.id || s?.data?.userId;
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

    // 6. Forward request to the student socket
    targetSocket.emit("get-current-code", {
      requestId,
      meetingId,
      teacherId: socket.user.id,
    });
  });

  // 🔹 Student Code Response (Student -> Server -> Teacher)
  socket.on("student-code-response", ({ requestId, meetingId, code, language }) => {
    if (!socket.user) return;

    console.log(`Received code response from student ${socket.user.id} for request ${requestId}`);

    io.to(meetingId).emit("receive-student-code", {
      requestId,
      studentId: socket.user.id,
      studentName: socket.user.username,
      code: typeof code === "string" ? code : "",
      language: language || "javascript",
      timestamp: Date.now(),
    });
  });
}
