// Values are read lazily so they reflect the environment loaded by dotenv at startup.
export const env = {
  get port(): number {
    return Number(process.env.PORT || 5000);
  },

  get clientUrl(): string {
    return process.env.CLIENT_URL || "http://localhost:5173";
  },

  get mongoUri(): string | undefined {
    return process.env.MONGODB_URI;
  },

  get jwtSecret(): string | undefined {
    return process.env.JWT_SECRET;
  },
};
