import { useCallback, useEffect, useState } from "react";
import { tokenStorage } from "../../../lib/tokenStorage";
import { fetchCurrentUser } from "../api";
import type { AuthUser } from "../types";

export function useAuthSession() {
  const [token, setToken] = useState(() => tokenStorage.get());
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authReady, setAuthReady] = useState(false);

  const clearSession = useCallback(() => {
    tokenStorage.clear();
    setToken("");
    setUser(null);
    setAuthReady(true);
  }, []);

  const startSession = useCallback((nextToken: string, nextUser: AuthUser) => {
    tokenStorage.set(nextToken);
    setUser(nextUser);
    setToken(nextToken);
  }, []);

  // Confirm a stored or freshly issued token still maps to a real account.
  useEffect(() => {
    if (!token) {
      setAuthReady(true);
      return;
    }
    let cancelled = false;
    fetchCurrentUser(token)
      .then((result) => {
        if (!cancelled) setUser(result.user);
      })
      .catch(() => {
        if (!cancelled) clearSession();
      })
      .finally(() => {
        if (!cancelled) setAuthReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, [token, clearSession]);

  return { token, user, authReady, startSession, clearSession };
}

export type AuthSession = ReturnType<typeof useAuthSession>;
