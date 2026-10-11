import { env } from "./env";

const MIN_SECRET_LENGTH = 32;

export const JWT_EXPIRES_IN = "1d";

export function getJwtSecret(): string {
  const secret = env.jwtSecret;

  if (!secret || secret.length < MIN_SECRET_LENGTH) {
    throw new Error(
      "JWT_SECRET must be configured with at least 32 characters",
    );
  }

  return secret;
}
