import jwt from "jsonwebtoken";

export default function socketAuth(socket, next) {
  const {token , meetingId} = socket.handshake.auth;

  if (!token) {
    return next(new Error("Unauthorized"));
  }

  try {
    const user = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );

    socket.user = user;
    socket.meetingId = meetingId;
    next();
  } catch (err) {
    next(new Error("Invalid token"));
  }
}
