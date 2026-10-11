import type { z } from "zod";
import { ValidationError } from "../errors";

export function parseOrThrow<Schema extends z.ZodType>(
  schema: Schema,
  input: unknown,
  message = "Validation failed",
): z.output<Schema> {
  const parsed = schema.safeParse(input);

  if (!parsed.success) {
    throw new ValidationError(
      message,
      parsed.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    );
  }

  return parsed.data;
}
