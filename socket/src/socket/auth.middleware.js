import jwt from "jsonwebtoken";

export default function socketAuth(socket, next) {
  const token = socket.handshake.auth?.token;

  if (!token) {
    return next(new Error("Unauthorized"));
  }

  try {
    const user = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );

    socket.user = user;
    next();
  } catch (err) {
    next(new Error("Invalid token"));
  }
}
