import Express from "express";
import { createServer } from "http";
import dotenv from "dotenv";
import initSocket from "./socket/index.js";

dotenv.config();

const app = Express();
app.use(Express.json());

const httpServer = createServer(app);

app.get("/health", (req, res) => {
  res.json({ status: "Socket server running 🚀" });
});

// 🔥 Socket setup moved out
initSocket(httpServer);

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`Socket server is running on port ${PORT}`);
});

