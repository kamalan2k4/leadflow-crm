import { z } from "zod";

// bcrypt only hashes the first 72 bytes of a password.
const MAX_PASSWORD_BYTES = 72;

const emailField = z.string().trim().toLowerCase().email().max(254);

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: emailField,
  password: z
    .string()
    .min(8)
    .refine(
      (password) => Buffer.byteLength(password, "utf8") <= MAX_PASSWORD_BYTES,
      "Password must not exceed 72 bytes",
    ),
});

export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1),
});

export type RegisterInput = z.output<typeof registerSchema>;
export type LoginInput = z.output<typeof loginSchema>;
