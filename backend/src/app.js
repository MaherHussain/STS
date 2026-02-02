import express from "express";
import authRoute from "../src/routes/auth.js";
import cookieParser from "cookie-parser";
import globalErrorHandler from "./middlewares/globalErrorHandler.js";

const app = express();

// Global middlewares
app.use(express.json());

// auth middleware

app.use(cookieParser());
// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

app.use("/api/auth/", authRoute);

// global error handler
app.use(globalErrorHandler);

export default app;
