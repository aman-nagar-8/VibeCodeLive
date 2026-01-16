export default function registerMeetingHandlers(socket, io) {
  socket.on("joinMeeting", (meetingId) => {
    socket.join(meetingId);

    socket.to(meetingId).emit("user-joined", {
      user: socket.user,
      socketId: socket.id,
    });
  });
}
