export type Role = "admin" | "agent" | "client";

export interface AuthUser {
  id: string;
  full_name?: string;
  name?: string;
  phone?: string;
  email?: string;
  role?: string;
  [key: string]: unknown;
}

export interface SessionPayload {
  user: AuthUser;
  role: Role;
}
