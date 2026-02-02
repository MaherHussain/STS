import express from "express";
import authRoute from "../src/routes/auth.js";
import cookieParser from "cookie-parser";

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

export default app;
