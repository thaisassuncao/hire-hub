import { useCallback, useEffect, useState, type ReactNode } from "react";
import api from "../api/client";
import type { User, TokenPair } from "../types/auth";
import { AuthContext } from "./AuthContext";

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = useCallback((tokens: TokenPair, user: User) => {
    localStorage.setItem("access_token", tokens.access_token);
    localStorage.setItem("refresh_token", tokens.refresh_token);
    setUser(user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
  }, []);

  useEffect(() => {
    const restoreSession = async () => {
      const refreshToken = localStorage.getItem("refresh_token");
      if (!refreshToken) {
        setIsLoading(false);
        return;
      }

      try {
        const { data: refreshData } = await api.post("/auth/refresh", {
          refresh_token: refreshToken,
        });
        const tokens = refreshData.data.tokens;
        localStorage.setItem("access_token", tokens.access_token);
        localStorage.setItem("refresh_token", tokens.refresh_token);

        const { data: meData } = await api.get("/auth/me");
        setUser(meData.data.user);
      } catch {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isLoading, isAuthenticated: !!user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
