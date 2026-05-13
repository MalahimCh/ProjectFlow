import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import meetingRoutes from "./routes/meetingRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import studentRoutes from "./routes/StudRoutes.js";
import supervisorRoutes from "./routes/SRoutes.js";

import streamRoutes from "./routes/streamRoutes.js";
import {
  notFoundHandler,
  globalErrorHandler,
} from "./middleware/errorHandler.js";

const app = express();

// Security middleware
app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);

// General middleware
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Root route
app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "ProjectFlow API Running",
  });
});

// Health route
app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "ProjectFlow API is running",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use("/api/auth", authRoutes);

app.use("/api/student", studentRoutes);
app.use("/api/supervisor", supervisorRoutes);
app.use("/api/meetings", meetingRoutes);

app.use("/api/projects/:projectId", streamRoutes);

// Error handlers
app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;
