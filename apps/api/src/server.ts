import app from "./app.js";
import { connectDatabase } from "./config/database.js";
import { env } from "./config/env.js";
import "./events/notification.handlers.js";
import "./events/audit.handlers.js";
import { createSocketServer } from "./socket/index.js";
import http from "node:http";
import { setSocketServer } from "./socket/socket-server.js";
import { logger } from "./utils/logger.js";

const startServer = async (): Promise<void> => {
  await connectDatabase();

  const httpServer = http.createServer(app);

  const io = createSocketServer(httpServer);

  setSocketServer(io);

  httpServer.listen(env.port, () => {
    logger.info("StudentOps API started", {
      port: env.port,
      environment: env.nodeEnv,
    });
  });
};
startServer().catch((error) => {
  logger.error("Failed to start server", {
    error:
      error instanceof Error
        ? {
            name: error.name,
            message: error.message,
            stack: error.stack,
          }
        : String(error),
  });
  
  process.exit(1);
});
