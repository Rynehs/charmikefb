import { create } from "zustand";
import { AuthUser, Role } from "@/types/auth";

interface AuthState {
  user: AuthUser | null;
  role: Role | null;
  setSession: (user: AuthUser | null, role: Role | null) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  role: null,
  setSession: (user, role) => set({ user, role }),
  clear: () => set({ user: null, role: null }),
}));
