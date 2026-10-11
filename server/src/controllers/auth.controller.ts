import type { RequestHandler } from "express";
import * as authService from "../services/auth.service";
import { toPublicUser } from "../utils/publicUser";
import { getUserId } from "../utils/request";
import { parseOrThrow } from "../utils/validation";
import { loginSchema, registerSchema } from "../validators/auth.validator";

// POST /api/auth/register
export const register: RequestHandler = async (req, res) => {
  const input = parseOrThrow(registerSchema, req.body);
  const user = await authService.registerUser(input);

  res.status(201).json({
    success: true,
    message: "Account created successfully",
    user: toPublicUser(user),
  });
};

// POST /api/auth/login
export const login: RequestHandler = async (req, res) => {
  const input = parseOrThrow(loginSchema, req.body);
  const { token, user } = await authService.loginUser(input);

  res.status(200).json({
    success: true,
    message: "Login successful",
    token,
    user: toPublicUser(user),
  });
};

// GET /api/auth/me
export const me: RequestHandler = async (req, res) => {
  const user = await authService.getCurrentUser(getUserId(req));

  res.status(200).json({
    success: true,
    user: toPublicUser(user),
  });
};
