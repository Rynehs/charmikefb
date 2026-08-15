"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import type {
  Agent,
  ApiEnvelope,
  DashboardStats,
  Loan,
  LoanApplication,
  PaginationMeta,
} from "@/types/api";

export function useDashboardStats() {
  return useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: async () => {
      const res = await api.get<ApiEnvelope<DashboardStats>>(
        "/admin/reports/dashboard"
      );
      return res.data.data;
    },
  });
}

export function useAgents() {
  return useQuery({
    queryKey: ["admin", "agents"],
    queryFn: async () => {
      const res = await api.get<
        ApiEnvelope<{ agents: Agent[]; meta: PaginationMeta }>
      >("/admin/agents");
      return res.data.data;
    },
  });
}

export function useLoans(status?: string) {
  return useQuery({
    queryKey: ["admin", "loans", status ?? "all"],
    queryFn: async () => {
      const res = await api.get<
        ApiEnvelope<{ loans: Loan[]; meta: PaginationMeta }>
      >("/admin/loans", { params: status ? { status } : {} });
      return res.data.data;
    },
  });
}

export function usePendingApplications() {
  return useQuery({
    queryKey: ["admin", "loans", "pending"],
    queryFn: async () => {
      const res = await api.get<
        ApiEnvelope<{ applications: LoanApplication[]; meta: PaginationMeta }>
      >("/admin/loans/pending");
      return res.data.data;
    },
  });
}

export function useApproveLoan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      interest_rate,
    }: {
      id: string;
      interest_rate: number;
    }) => {
      const res = await api.post<ApiEnvelope<Loan>>(
        `/admin/loans/${id}/approve`,
        { interest_rate }
      );
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "loans"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    },
  });
}

export function useRejectLoan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
      const res = await api.post<ApiEnvelope<LoanApplication>>(
        `/admin/loans/${id}/reject`,
        { reason }
      );
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "loans"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    },
  });
}

export function useDisburseLoan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      reference,
    }: {
      id: string;
      reference: string;
    }) => {
      const res = await api.post<ApiEnvelope<Loan>>(
        `/admin/loans/${id}/disburse`,
        { reference }
      );
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "loans"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    },
  });
}
