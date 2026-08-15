"use client";

import { useQuery } from "@tanstack/react-query";
import { SessionPayload } from "@/types/auth";

async function fetchSession(): Promise<SessionPayload | null> {
  const res = await fetch("/api/auth/session", { credentials: "include" });
  if (res.status === 401) return null;
  if (!res.ok) throw new Error("Failed to fetch session");
  return res.json();
}

export function useSession() {
  return useQuery({
    queryKey: ["session"],
    queryFn: fetchSession,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}
