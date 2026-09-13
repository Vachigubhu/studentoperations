import mongoose from "mongoose";

export const getHealthStatus = () => {
  return {
    status: "ok",
    service: "studentops-api",
    database:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  };
};
