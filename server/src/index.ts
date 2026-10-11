import "dotenv/config";
import { app } from "./app";
import { connectDatabase } from "./config/database";
import { env } from "./config/env";

async function startServer(): Promise<void> {
  const port = env.port;

  try {
    await connectDatabase();

    app.listen(port, () => {
      console.log(`LeadFlow API running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start LeadFlow API:", error);
    process.exitCode = 1;
  }
}

void startServer();
