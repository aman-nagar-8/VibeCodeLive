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
    console.log(`Code snapshot for meeting ${meetingId}:`, snapshot , "from user:", socket.user.id); ;
    io.to(meetingId).emit("receive-code-snapshot", { snapshot, from: socket.user.id });
  });
}
