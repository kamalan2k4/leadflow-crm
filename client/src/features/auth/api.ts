import { apiRequest } from "../../lib/api";
import type {
  AuthResponse,
  AuthUser,
  LoginCredentials,
  RegisterDetails,
} from "./types";

export function register(details: RegisterDetails) {
  return apiRequest<{ success: boolean; message: string }>("/auth/register", {
    method: "POST",
    body: details,
  });
}

export function login(credentials: LoginCredentials) {
  return apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: credentials,
  });
}

export function fetchCurrentUser(token: string) {
  return apiRequest<{ success: boolean; user: AuthUser }>("/auth/me", {
    token,
  });
}
