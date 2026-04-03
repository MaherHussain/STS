import express from "express";
import authRoute from "../src/routes/auth.js";
import userRouter from "./routes/user.js";
import cookieParser from "cookie-parser";
import globalErrorHandler from "./middlewares/globalErrorHandler.js";
import cors from "cors";
import shiftLogRouter from "./routes/shift.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const allowedOrigins = [
  ...(process.env.FRONTEND_URL || "").split(","),
  ...(process.env.CORS_ORIGIN || "").split(","),
  "http://localhost:5173", // Default local dev
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);
// Global middlewares
app.use(express.json());

// auth middleware

app.use(cookieParser());
// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

app.use("/api/auth/", authRoute);
app.use("/api/user/", userRouter);

app.use("/api/shift/", shiftLogRouter);

// Serve static files from the uploads directory
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// global error handler
app.use(globalErrorHandler);

export default app;
