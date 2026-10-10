import type { RequestHandler } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { getJwtSecret } from "../config/jwt";
import { AppError } from "./errorHandler";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
      };
    }
  }
}

export const authenticate: RequestHandler = (
  req,
  _res,
  next,
) => {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    next(new AppError(401, "Authentication required"));
    return;
  }

  const token = authorization.slice(7).trim();

  if (!token) {
    next(new AppError(401, "Authentication required"));
    return;
  }

  try {
    const decoded = jwt.verify(token, getJwtSecret());

    if (
      typeof decoded === "string" ||
      typeof (decoded as JwtPayload).userId !== "string"
    ) {
      next(new AppError(401, "Invalid authentication token"));
      return;
    }

    req.user = {
      id: (decoded as JwtPayload).userId as string,
    };

    next();
  } catch {
    next(new AppError(401, "Invalid or expired authentication token"));
  }
};