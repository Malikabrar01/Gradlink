import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import { allowedOrigins } from "../config/origins.js";

let io;

const parseCookies = (header = "") =>
  Object.fromEntries(
    header
      .split(";")
      .map((part) => part.trim().split("="))
      .filter(([k]) => k)
      .map(([k, ...v]) => [k, decodeURIComponent(v.join("="))])
  );

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: { origin: allowedOrigins, credentials: true },
  });

  io.use((socket, next) => {
    try {
      const cookies = parseCookies(socket.handshake.headers.cookie);
      const token = cookies.accessToken || socket.handshake.auth?.token;
      if (!token) return next(new Error("Unauthorized"));
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      socket.userId = String(decoded._id);
      next();
    } catch {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    socket.join(`user:${socket.userId}`);
  });

  return io;
};

export const notifyUser = (userId, payload) => {
  if (!io || !userId) return;
  io.to(`user:${String(userId)}`).emit("notification", {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    ...payload,
  });
};