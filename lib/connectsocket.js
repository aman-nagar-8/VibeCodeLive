import { io } from "socket.io-client";
import { getAccessToken } from "./getAccessToken.js";

let socket;

// const socket = io("http://localhost:4000", {
//   auth: {
//     token: null, // initially null
//   },
// });

 export async function connectSocket() {
 if (socket && socket.connected) {
    return socket;
  }

  const token = await getAccessToken();

   socket = io("http://localhost:4000", {
    auth: {
      token, // ACCESS TOKEN ONLY
    },
  });
  
  socket.connect();

  socket.on("connect_error", async (err) => {
    if (err.message === "Invalid or expired token") {
      const newToken = await getAccessToken();
      socket.auth.token = newToken;
      socket.connect();
    }
  });

  return socket;
}

export function getSocket() {
  return socket;
}



