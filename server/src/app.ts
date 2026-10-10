import express from "express";
import cors from "cors";
import { healthRouter } from "./routes/health";
import { authRouter } from "./routes/auth";
import { errorHandler } from "./middleware/errorHandler";

export const app = express();

app.disable("x-powered-by");

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  }),
);

app.use(express.json({ limit: "1mb" }));

app.use("/api/health", healthRouter);
app.use("/api/auth", authRouter);

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use(errorHandler);