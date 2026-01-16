import jwt from "jsonwebtoken";

export default function socketAuth(socket, next) {
  const token = socket.handshake.auth?.token;
  console.log("token : " , token)

  if (!token) {
    return next(new Error("Unauthorized"));
  }

  try {
    const user = jwt.verify(
      token,
      process.env.SOCKET_JWT_SECRET
    );
    console.log("user : " , user)

    socket.user = user;
    next();
  } catch (err) {
    next(new Error("Invalid token"));
  }
}
