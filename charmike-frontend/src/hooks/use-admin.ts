"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import type {
  Agent,
  ApiEnvelope,
  ClientSummary,
  Commission,
  DashboardStats,
  Loan,
  LoanApplication,
  PaginationMeta,
  Settings,
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

export function useAgents(page: number = 1) {
  return useQuery({
    queryKey: ["admin", "agents", page],
    queryFn: async () => {
      const res = await api.get<
        ApiEnvelope<{ agents: Agent[]; meta: PaginationMeta }>
      >("/admin/agents", { params: { page } });
      return res.data.data;
    },
  });
}

export function useAgentDetail(id: string | null) {
  return useQuery({
    queryKey: ["admin", "agents", "detail", id],
    queryFn: async () => {
      const res = await api.get<ApiEnvelope<Agent>>(`/admin/agents/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
}

interface CreateAgentPayload {
  full_name: string;
  phone: string;
  email?: string;
  password: string;
}

export function useCreateAgent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateAgentPayload) => {
      const res = await api.post<ApiEnvelope<Agent>>(
        "/admin/agents",
        payload
      );
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "agents"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    },
  });
}

interface UpdateAgentPayload {
  full_name?: string;
  phone?: string;
  email?: string | null;
  password?: string;
}

export function useUpdateAgent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateAgentPayload;
    }) => {
      const res = await api.put<ApiEnvelope<Agent>>(
        `/admin/agents/${id}`,
        payload
      );
      return res.data.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "agents"] });
      queryClient.invalidateQueries({
        queryKey: ["admin", "agents", "detail", variables.id],
      });
    },
  });
}

export function useToggleAgentActive() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      activate,
    }: {
      id: string;
      activate: boolean;
    }) => {
      const res = await api.patch<ApiEnvelope<Agent>>(
        `/admin/agents/${id}/${activate ? "activate" : "deactivate"}`
      );
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "agents"] });
    },
  });
}

export function useDeleteAgent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete<ApiEnvelope<null>>(`/admin/agents/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "agents"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    },
  });
}

export function useClients(params: {
  page?: number;
  agent_id?: string;
  search?: string;
}) {
  const { page = 1, agent_id, search } = params;
  return useQuery({
    queryKey: ["admin", "clients", page, agent_id ?? "", search ?? ""],
    queryFn: async () => {
      const res = await api.get<
        ApiEnvelope<{ clients: ClientSummary[]; meta: PaginationMeta }>
      >("/admin/clients", {
        params: {
          page,
          ...(agent_id ? { agent_id } : {}),
          ...(search ? { search } : {}),
        },
      });
      return res.data.data;
    },
  });
}

export function useClientDetail(id: string | null) {
  return useQuery({
    queryKey: ["admin", "clients", "detail", id],
    queryFn: async () => {
      const res = await api.get<ApiEnvelope<ClientSummary>>(
        `/admin/clients/${id}`
      );
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useLoans(status?: string, page: number = 1) {
  return useQuery({
    queryKey: ["admin", "loans", status ?? "all", page],
    queryFn: async () => {
      const res = await api.get<
        ApiEnvelope<{ loans: Loan[]; meta: PaginationMeta }>
      >("/admin/loans", { params: { page, ...(status ? { status } : {}) } });
      return res.data.data;
    },
  });
}

export function useAdminLoanDetail(id: string | null) {
  return useQuery({
    queryKey: ["admin", "loans", "detail", id],
    queryFn: async () => {
      const res = await api.get<ApiEnvelope<Loan>>(`/admin/loans/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function usePendingApplications(page: number = 1) {
  return useQuery({
    queryKey: ["admin", "loans", "pending", page],
    queryFn: async () => {
      const res = await api.get<
        ApiEnvelope<{ applications: LoanApplication[]; meta: PaginationMeta }>
      >("/admin/loans/pending", { params: { page } });
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

export function useAdminCommissions(page: number = 1) {
  return useQuery({
    queryKey: ["admin", "commissions", page],
    queryFn: async () => {
      const res = await api.get<
        ApiEnvelope<{ commissions: Commission[]; meta: PaginationMeta }>
      >("/admin/reports/commissions", { params: { page } });
      return res.data.data;
    },
  });
}

export function useSettings() {
  return useQuery({
    queryKey: ["admin", "settings"],
    queryFn: async () => {
      const res = await api.get<ApiEnvelope<Settings>>("/admin/settings");
      return res.data.data;
    },
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (settings: { key: string; value: string }[]) => {
      const res = await api.put<ApiEnvelope<null>>("/admin/settings", {
        settings,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "settings"] });
    },
  });
}
