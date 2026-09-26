import { logger } from "./logger.js";

export const registerProcessErrorHandlers = (): void => {
  process.on("uncaughtException", (error) => {
    logger.error("Uncaught exception", {
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

  process.on("unhandledRejection", (reason) => {
    logger.error("Unhandled promise rejection", {
      error:
        reason instanceof Error
          ? {
              name: reason.name,
              message: reason.message,
              stack: reason.stack,
            }
          : String(reason),
    });

    process.exit(1);
  });
};
