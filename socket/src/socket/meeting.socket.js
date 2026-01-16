export default function registerMeetingHandlers({io, socket}) {
  socket.on("join-meeting", ({meetingId}) => {
    socket.join(meetingId);
    console.log("user join meeting room");

    socket.to(meetingId).emit("user-joined", {
      user: socket.user,
      socketId: socket.id,
    });
  });
}
