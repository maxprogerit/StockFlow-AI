import { create } from "zustand";

type User = { id: string; fullName: string; email: string; role: "ADMIN" | "MANAGER" | "EMPLOYEE" } | null;

type AuthState = {
  token: string | null;
  refreshToken: string | null;
  user: User;
  setSession: (payload: { accessToken: string; refreshToken: string; user: NonNullable<User> }) => void;
  setTokens: (token: string, refreshToken: string) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  refreshToken: null,
  user: null,
  setSession: ({ accessToken, refreshToken, user }) =>
    set({
      token: accessToken,
      refreshToken,
      user
    }),
  setTokens: (token, refreshToken) => set({ token, refreshToken }),
  logout: () => set({ token: null, refreshToken: null, user: null })
}));

