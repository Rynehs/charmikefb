"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import type {
  AgentDashboardStats,
  ApiEnvelope,
  ClientSummary,
  Commission,
  Loan,
  PaginationMeta,
} from "@/types/api";

// agent/clients returns the same shape as admin/clients.
type Client = ClientSummary;

export function useAgentDashboard() {
  return useQuery({
    queryKey: ["agent", "dashboard"],
    queryFn: async () => {
      const res = await api.get<ApiEnvelope<AgentDashboardStats>>(
        "/agent/dashboard"
      );
      return res.data.data;
    },
  });
}

export function useAgentClients() {
  return useQuery({
    queryKey: ["agent", "clients"],
    queryFn: async () => {
      const res = await api.get<
        ApiEnvelope<{ clients: Client[]; meta: PaginationMeta }>
      >("/agent/clients");
      return res.data.data;
    },
  });
}

export function useAgentLoans() {
  return useQuery({
    queryKey: ["agent", "loans"],
    queryFn: async () => {
      const res = await api.get<
        ApiEnvelope<{ loans: Loan[]; meta: PaginationMeta }>
      >("/agent/loans");
      return res.data.data;
    },
  });
}

export function useAgentCommissions() {
  return useQuery({
    queryKey: ["agent", "commissions"],
    queryFn: async () => {
      const res = await api.get<
        ApiEnvelope<{ commissions: Commission[]; meta: PaginationMeta }>
      >("/agent/commissions");
      return res.data.data;
    },
  });
}
