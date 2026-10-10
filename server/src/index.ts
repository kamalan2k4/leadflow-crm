import "dotenv/config";
import { app } from "./app";
import { connectDatabase } from "./config/database";

const port = Number(process.env.PORT || 5000);

async function startServer(): Promise<void> {
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