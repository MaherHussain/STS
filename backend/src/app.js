import express from "express";

const app = express();

// Global middlewares
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

export default app;
