export default function registerMeetingHandlers(socket, io) {
  socket.on("joinMeeting", (meetingId) => {
    socket.join(meetingId);
    console.log(`User ${socket.user.id} joined meeting ${meetingId}`);

    socket.to(meetingId).emit("user-joined", {
      user: socket.user,
      socketId: socket.id,
    });
  });
}
