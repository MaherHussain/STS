import express from "express";
import authRoute from "../src/routes/auth.js";
import userRouter from "./routes/user.js";
import cookieParser from "cookie-parser";
import globalErrorHandler from "./middlewares/globalErrorHandler.js";
import cors from "cors";
import shiftLogRouter from "./routes/shift.js";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
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
// global error handler
app.use(globalErrorHandler);

export default app;
