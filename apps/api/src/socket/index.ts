import { Server as HttpServer } from "node:http";
import { Server } from "socket.io";
import { verifyAccessToken } from "../utils/tokens.js";
import { setSocketServer } from "./socket-server.js";

export const createSocketServer = (httpServer: HttpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  setSocketServer(io);

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;

      if (!token) {
        next(new Error("Authentication required"));
        return;
      }

      const payload = verifyAccessToken(token);

      socket.data.user = {
        userId: payload.userId,
        role: payload.role,
        departmentId: payload.departmentId,
      };

      next();
    } catch {
      next(new Error("Invalid or expired token"));
    }
  });

  io.on("connection", (socket) => {
    const user = socket.data.user;

    console.log(`Socket connected: ${user.userId}`);

    socket.join(`user:${user.userId}`);

    socket.on("disconnect", () => {
      console.log(`Socket disconnected : ${user.userId}`);
    });
  });

  return io;
};
