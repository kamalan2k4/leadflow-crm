import express from "express";
import cors from "cors";
import { getCorsOptions } from "./config/cors";
import { errorHandler } from "./middleware/errorHandler";
import { notFound } from "./middleware/notFound";
import { apiRouter } from "./routes";

export const app = express();

app.disable("x-powered-by");

app.use(cors(getCorsOptions()));

app.use(express.json({ limit: "1mb" }));

app.use("/api", apiRouter);

app.use(notFound);

app.use(errorHandler);
