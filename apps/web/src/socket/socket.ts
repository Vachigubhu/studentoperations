import { io, type Socket } from "socket.io-client";

import { authStorage } from "../utils/auth-storage";

const SOCKET_URL =
  import.meta.env.VITE_API_URL?.replace(/\/api\/v1\/?$/, "") ??
  "http://localhost:5000";

let socket: Socket | null = null;

export const getSocket = () => {
  const accessToken = authStorage.getAccessToken();

  if (!accessToken) {
    return null;
  }

  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: false,
      auth: {
        token: accessToken,
      },
    });
  }

  return socket;
};

export const connectSocket = () => {
  const currentSocket = getSocket();

  if (!currentSocket) {
    return null;
  }

  if (!currentSocket.connected) {
    currentSocket.connect();
  }

  return currentSocket;
};

export const disconnectSocket = () => {
  if (!socket) {
    return;
  }

  socket.disconnect();
  socket = null;
};
