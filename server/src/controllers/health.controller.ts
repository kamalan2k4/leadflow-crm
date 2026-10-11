import type { RequestHandler } from "express";

// GET /api/health
export const getHealth: RequestHandler = (_req, res) => {
  res.status(200).json({
    success: true,
    message: "LeadFlow API is running",
    timestamp: new Date().toISOString(),
  });
};
