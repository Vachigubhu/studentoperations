import { io } from "socket.io-client";

const token = process.env.TEST_ACCESS_TOKEN;

if (!token) {
  console.error("TEST_ACCESS_TOKEN environment variable is required");
  process.exit(1);
}

const socket = io("http://localhost:5000", {
  auth: {
    token,
  },
});

socket.on("connect", () => {
  console.log("Socket connected successfully");
  console.log("Socket ID:", socket.id);
  console.log("Waiting for message:new...");
});

socket.on("message:new", (payload) => {
  console.log("\nReceived message:new:");
  console.log(JSON.stringify(payload, null, 2));

  socket.disconnect();
});

socket.on("connect_error", (error) => {
  console.error("Socket connection failed:", error.message);

  process.exit(1);
});

socket.on("disconnect", (reason) => {
  console.log("Socket disconnected:", reason);

  process.exit(0);
});
