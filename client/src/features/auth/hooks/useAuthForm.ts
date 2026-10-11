import { useState } from "react";
import type { FormEvent } from "react";
import { getErrorMessage } from "../../../utils/errors";
import * as authApi from "../api";
import type { AuthMode, AuthUser } from "../types";

export function useAuthForm(
  onAuthenticated: (token: string, user: AuthUser) => void,
) {
  const [mode, setMode] = useState<AuthMode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      // Registering does not return a token, so new accounts sign in right after.
      if (mode === "register") {
        await authApi.register({ name, email, password });
      }
      const result = await authApi.login({ email, password });
      if (!result.token) {
        throw new Error("The server did not return an authentication token.");
      }
      onAuthenticated(result.token, result.user);
    } catch (caught) {
      setError(getErrorMessage(caught));
    } finally {
      setBusy(false);
    }
  }

  function toggleMode() {
    setMode(mode === "login" ? "register" : "login");
    setError("");
  }

  function clearError() {
    setError("");
  }

  return {
    mode,
    name,
    email,
    password,
    busy,
    error,
    setName,
    setEmail,
    setPassword,
    submit,
    toggleMode,
    clearError,
  };
}

export type AuthFormState = ReturnType<typeof useAuthForm>;
