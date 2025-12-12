import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import cors from "cors";
import multer from "multer";

const app = express();

// Update with your actual Vercel domain
const allowedOrigins = [
  "http://localhost:5173",
  "https://your-app.vercel.app", // Your Vercel domain
  "https://annutamilarasu.github.io", // Your GitHub Pages domain
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ message: "Socket.IO server is running", status: "ok" });
});

app.post("/upload", upload.single("picture"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded." });
  }

  const fileContent = req.file.buffer.toString("utf-8");
  console.log("📄 File content:\n", fileContent);

  res.json({
    message: `Read file ${req.file.originalname} successfully!`,
    content: fileContent,
  });
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
});

io.on("connection", (socket: Socket) => {
  console.log("🟢 New client connected:", socket.id);

  socket.on("codeUpdate", (newCode: string) => {
    console.log("🟢 codeUpdate event:", socket.id);
    socket.broadcast.emit("codeUpdate", newCode);
  });

  socket.on("createFile", (newCode: string) => {
    console.log("🟢 createFile event:", socket.id);
    socket.broadcast.emit("fileCreated", newCode);
  });

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});