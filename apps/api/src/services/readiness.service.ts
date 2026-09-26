import { isDatabaseConnected } from "../config/database.js";

export const getReadinessStatus = () => {
  const database = isDatabaseConnected();

  return {
    ready: database,
    checks: {
      database: database ? "up" : "down",
    },
  };
};
