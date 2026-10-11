const TOKEN_KEY = "leadflow_token";

export const tokenStorage = {
  get(): string {
    return localStorage.getItem(TOKEN_KEY) ?? "";
  },

  set(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  },

  clear(): void {
    localStorage.removeItem(TOKEN_KEY);
  },
};
