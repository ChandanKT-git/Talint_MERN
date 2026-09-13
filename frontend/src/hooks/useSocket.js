import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

export function useSocket(roomId) {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!roomId) return;

    // Connect to the Socket.IO server
    const socketInstance = io(
      import.meta.env.MODE === "development" ? "http://localhost:3000" : "/",
      {
        withCredentials: true,
      }
    );

    setSocket(socketInstance);

    socketInstance.on("connect", () => {
      setIsConnected(true);
      socketInstance.emit("join-room", { roomId });
    });

    socketInstance.on("disconnect", () => {
      setIsConnected(false);
    });

    // Chat functionality
    socketInstance.on("receive-message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    // Load persisted chat history
    socketInstance.on("chat-history", (history) => {
      setMessages(history);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [roomId]);

  const sendMessage = (text, senderName, senderImage) => {
    if (socket) {
      socket.emit("send-message", { text, senderName, senderImage });
    }
  };

  const emitCodeChange = (code, language) => {
    if (socket) {
      socket.emit("code-change", { code, language });
    }
  };

  return { socket, isConnected, messages, sendMessage, emitCodeChange };
}
