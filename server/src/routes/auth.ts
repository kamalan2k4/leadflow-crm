import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";

import { UserModel } from "../models/User";
import { AppError } from "../middleware/errorHandler";
import { authenticate } from "../middleware/authenticate";
import { getJwtSecret } from "../config/jwt";

export const authRouter = Router();

const registerSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().toLowerCase().email().max(254),
  password: z
    .string()
    .min(8)
    .refine(
      (password) => Buffer.byteLength(password, "utf8") <= 72,
      "Password must not exceed 72 bytes",
    ),
});

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  password: z.string().min(1),
});

function sendValidationError(
  res: import("express").Response,
  issues: z.ZodIssue[],
) {
  return res.status(400).json({
    success: false,
    message: "Validation failed",
    errors: issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    })),
  });
}

function publicUser(user: {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  };
}

// POST /api/auth/register
authRouter.post("/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);

  if (!parsed.success) {
    sendValidationError(res, parsed.error.issues);
    return;
  }

  const { name, email, password } = parsed.data;

  const existingUser = await UserModel.exists({ email });

  if (existingUser) {
    throw new AppError(409, "An account with this email already exists");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  try {
    const user = await UserModel.create({
      name,
      email,
      passwordHash,
    });

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      user: publicUser(user),
    });
  } catch (error) {
    // The unique database index also protects against simultaneous registrations.
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === 11000
    ) {
      throw new AppError(409, "An account with this email already exists");
    }

    throw error;
  }
});

// POST /api/auth/login
authRouter.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);

  if (!parsed.success) {
    sendValidationError(res, parsed.error.issues);
    return;
  }

  const { email, password } = parsed.data;

  const user = await UserModel.findOne({ email }).select("+passwordHash");

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new AppError(401, "Invalid email or password");
  }

  const token = jwt.sign(
    { userId: user.id },
    getJwtSecret(),
    { expiresIn: "1d" },
  );

  res.status(200).json({
    success: true,
    message: "Login successful",
    token,
    user: publicUser(user),
  });
});

// GET /api/auth/me
authRouter.get("/me", authenticate, async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError(401, "Authentication required");
  }

  const user = await UserModel.findById(userId);

  if (!user) {
    throw new AppError(401, "User account no longer exists");
  }

  res.status(200).json({
    success: true,
    user: publicUser(user),
  });
});