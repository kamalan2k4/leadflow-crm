import { Router } from "express";

export const healthRouter = Router();

healthRouter.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "LeadFlow API is running",
    timestamp: new Date().toISOString(),
  });
});