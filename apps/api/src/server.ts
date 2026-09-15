import app from "./app.js";
import { connectDatabase } from "./config/database.js";
import { env } from "./config/env.js";
import "./events/notification.handlers.js";
import "./events/audit.handlers.js";
import { createSocketServer } from "./socket/index.js";
import http from "node:http";
import { setSocketServer } from "./socket/socket-server.js";

const startServer = async (): Promise<void> => {
  await connectDatabase();

  const httpServer = http.createServer(app);

  const io = createSocketServer(httpServer);

  setSocketServer(io);

  httpServer.listen(env.port, () => {
    console.log(`StudentOps API running on http://localhost:${env.port}`);
  });
};

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
