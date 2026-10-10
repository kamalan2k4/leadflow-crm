import type { ErrorRequestHandler } from "express";

export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export const errorHandler: ErrorRequestHandler = (
  err,
  _req,
  res,
  _next,
) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  console.error("Unexpected API error:", err);

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};