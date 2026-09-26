import type { Server } from "node:http";
import mongoose from "mongoose";
import { logger } from "./logger.js";

let shuttingDown = false;

export const registerShutdownHandlers = (httpServer: Server): void => {
  const shutdown = async (signal: string): Promise<void> => {
    if (shuttingDown) {
      return;
    }

    shuttingDown = true;

    logger.info("Shutdown requested", {
      signal,
    });

    httpServer.close(async () => {
      try {
        await mongoose.connection.close();

        logger.info("StudentOps API shutdown complete");

        process.exit(0);
      } catch (error) {
        logger.error("Error during shutdown", {
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
      }
    });
  };

  process.on("SIGTERM", () => {
    void shutdown("SIGTERM");
  });

  process.on("SIGINT", () => {
    void shutdown("SIGINT");
  });
};
