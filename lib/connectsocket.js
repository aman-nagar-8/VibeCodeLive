import { io } from "socket.io-client";

const socket = io("http://localhost:3001", {
  autoConnect: false,
});

export function connectSocket(token) {
  socket.auth = { token };
  socket.connect();
  return socket;
}

export function getSocket() {
  return socket;
}


