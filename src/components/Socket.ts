import { io } from "socket.io-client";

// Use environment variable, fallback to localhost for development
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:4000";

export const socket = io(SOCKET_URL, {
  transports: ['websocket', 'polling'],
  autoConnect: true,
});

socket.on("connect", () => {
  console.log("✅ Connected to Socket.IO server:", socket.id);
});

socket.on("connect_error", (error) => {
  console.error("❌ Socket connection error:", error);
});