import { initSocket } from "@/lib/socketServer";

export const GET = async (req) => {
  if (!global.server) {
    global.server = require("http").createServer();
    initSocket(global.server);

    global.server.listen(3001, () => {
      console.log("Socket.io running on port 3001");
    });
  }

  return new Response("Socket server running", { status: 200 });
};
