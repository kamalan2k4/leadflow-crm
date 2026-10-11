import mongoose from "mongoose";
import { env } from "./env";

const SERVER_SELECTION_TIMEOUT_MS = 10000;

export async function connectDatabase(): Promise<void> {
  const uri = env.mongoUri;

  if (!uri) {
    throw new Error("MONGODB_URI is not configured");
  }

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: SERVER_SELECTION_TIMEOUT_MS,
  });

  console.log("MongoDB connected successfully");
}
