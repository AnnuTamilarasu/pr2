import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import cors from "cors";
import multer from "multer";

// Create express app
const app = express();
app.use(cors());

// Use multer memory storage (doesn't save file to disk)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// File upload route — reads text directly
app.post("/upload", upload.single("picture"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded." });
  }

  // Convert buffer to string
  const fileContent = req.file.buffer.toString("utf-8");
  console.log("📄 File content:\n", fileContent);

  // Respond with file content
  res.json({
    message: `Read file ${req.file.originalname} successfully!`,
    content: fileContent,
  });
});

// Create HTTP server and wrap with socket.io
import { createServer } from "http";
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Socket.io logic
io.on("connection", (socket: Socket) => {
  console.log("🟢 New client connected:", socket.id);

  socket.on("codeChange", (newCode: string) => {
    socket.broadcast.emit("codeUpdate", newCode);
  });

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });
});

// Start server
const PORT = 4000;
server.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
