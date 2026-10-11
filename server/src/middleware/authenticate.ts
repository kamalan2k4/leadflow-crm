import type { RequestHandler } from "express";
import type { JwtPayload } from "jsonwebtoken";
import { AppError } from "../errors";
import { verifyAuthToken } from "../utils/token";

const BEARER_PREFIX = "Bearer ";

export const authenticate: RequestHandler = (
  req,
  _res,
  next,
) => {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith(BEARER_PREFIX)) {
    next(new AppError(401, "Authentication required"));
    return;
  }

  const token = authorization.slice(BEARER_PREFIX.length).trim();

  if (!token) {
    next(new AppError(401, "Authentication required"));
    return;
  }

  try {
    const decoded = verifyAuthToken(token);

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
