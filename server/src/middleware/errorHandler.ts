import type { ErrorRequestHandler } from "express";
import { AppError, ValidationError } from "../errors";

export const errorHandler: ErrorRequestHandler = (
  err,
  _req,
  res,
  _next,
) => {
  if (err instanceof ValidationError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
    });
    return;
  }

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
