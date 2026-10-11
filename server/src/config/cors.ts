import type { CorsOptions } from "cors";
import { env } from "./env";

export function getCorsOptions(): CorsOptions {
  return {
    origin: env.clientUrl,
  };
}
