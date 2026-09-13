import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { ENV } from "./lib/env.js";
import Message from "./models/Message.js";

export function initializeSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: ENV.NODE_ENV === "production" ? process.env.CLIENT_URL : "http://localhost:5173",
      credentials: true,
      methods: ["GET", "POST"],
    },
  });

  // Verify auth on socket connection
  io.use((socket, next) => {
    try {
      const cookieStr = socket.handshake.headers.cookie;
      if (!cookieStr) {
        return next(new Error("Authentication error"));
      }
      
      const jwtCookie = cookieStr
        .split(";")
        .map(v => v.trim())
        .find(v => v.startsWith("jwt="));
        
      if (!jwtCookie) {
        return next(new Error("Authentication error"));
      }

      const token = jwtCookie.split("=")[1];
      const decoded = jwt.verify(token, ENV.JWT_SECRET);
      
      if (!decoded) {
        return next(new Error("Authentication error"));
      }
      
      socket.userId = decoded.userId;
      next();
    } catch (err) {
      console.log("Socket auth error", err);
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    console.log("User connected", socket.userId);

    socket.on("join-room", async ({ roomId }) => {
      socket.join(roomId);
      console.log(`User ${socket.userId} joined room ${roomId}`);

      // Send chat history to the user who just joined
      try {
        const history = await Message.find({ roomId })
          .sort({ createdAt: 1 })
          .limit(100)
          .lean();
        if (history.length > 0) {
          socket.emit("chat-history", history);
        }
      } catch (err) {
        console.log("Error loading chat history", err);
      }
      
      // Notify others in room
      socket.to(roomId).emit("user-connected", { userId: socket.userId });

      // Code sync
      socket.on("code-change", ({ code, language }) => {
        socket.to(roomId).emit("code-update", { code, language });
      });

      // Chat
      socket.on("send-message", async ({ text, senderName, senderImage }) => {
        const messageData = { 
          text, 
          senderId: socket.userId, 
          senderName, 
          senderImage,
          roomId,
          createdAt: new Date().toISOString()
        };

        // Persist message to MongoDB
        try {
          await Message.create({
            roomId,
            senderId: socket.userId,
            senderName,
            senderImage,
            text,
          });
        } catch (err) {
          console.log("Error saving message", err);
        }

        io.to(roomId).emit("receive-message", messageData);
      });

      // WebRTC Signaling
      socket.on("offer", (payload) => {
        socket.to(roomId).emit("offer", payload);
      });

      socket.on("answer", (payload) => {
        socket.to(roomId).emit("answer", payload);
      });

      socket.on("ice-candidate", (payload) => {
        socket.to(roomId).emit("ice-candidate", payload);
      });

      socket.on("disconnect", () => {
        socket.to(roomId).emit("user-disconnected", { userId: socket.userId });
      });
    });
  });

  return io;
}
