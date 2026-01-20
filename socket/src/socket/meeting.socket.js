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
            userId: s.user.userId,
            username: s.user.username,
          });
        }
      }
    }
    socket.emit("meeting-members", members);

    socket.to(meetingId).emit("user-joined", {
      user: socket.user,
      socketId: socket.id,
    });
  });
}
