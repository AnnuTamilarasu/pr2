import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket: Socket) => {
  console.log("🟢 New client connected:", socket.id);

  socket.on("codeChange", (newCode: string) => {
    socket.broadcast.emit("codeUpdate", newCode);
  });

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });
});

const PORT = 4000;
server.listen(PORT, () =>
  console.log(`✅ Socket.IO server running on port ${PORT}`)
);
