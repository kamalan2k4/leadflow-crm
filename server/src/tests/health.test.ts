import test from "node:test";
import assert from "node:assert/strict";
import { app } from "../app";

test("GET /api/health returns a successful response", async () => {
  const server = app.listen(0);

  try {
    await new Promise<void>((resolve, reject) => {
      server.once("listening", resolve);
      server.once("error", reject);
    });

    const address = server.address();

    if (!address || typeof address === "string") {
      throw new Error("Could not determine test server address");
    }

    const response = await fetch(
      `http://127.0.0.1:${address.port}/api/health`,
    );

    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.success, true);
    assert.equal(body.message, "LeadFlow API is running");
    assert.ok(body.timestamp);
  } finally {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => {
        if (error) reject(error);
        else resolve();
      });
    });
  }
});