import type { Request } from "express";
import { AppError } from "../errors";

export function getUserId(req: Pick<Request, "user">): string {
  if (!req.user?.id) {
    throw new AppError(401, "Authentication required");
  }

  return req.user.id;
}
