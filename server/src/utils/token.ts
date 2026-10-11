import jwt, { type JwtPayload } from "jsonwebtoken";
import { getJwtSecret, JWT_EXPIRES_IN } from "../config/jwt";

export function signAuthToken(userId: string): string {
  return jwt.sign(
    { userId },
    getJwtSecret(),
    { expiresIn: JWT_EXPIRES_IN },
  );
}

// Throws when the token is malformed, tampered with, or expired.
export function verifyAuthToken(token: string): string | JwtPayload {
  return jwt.verify(token, getJwtSecret());
}
