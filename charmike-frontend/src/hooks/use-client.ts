"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import type {
  ApiEnvelope,
  ClientSummary,
  Loan,
  LoanApplication,
  Payment,
  PaginationMeta,
} from "@/types/api";

export function useClientProfile() {
  return useQuery({
    queryKey: ["client", "profile"],
    queryFn: async () => {
      const res = await api.get<ApiEnvelope<ClientSummary>>(
        "/client/profile"
      );
      return res.data.data;
    },
  });
}

export function useClientApplications() {
  return useQuery({
    queryKey: ["client", "loans"],
    queryFn: async () => {
      const res = await api.get<
        ApiEnvelope<{ applications: LoanApplication[]; meta: PaginationMeta }>
      >("/client/loans");
      return res.data.data;
    },
  });
}

export function useClientActiveLoans() {
  return useQuery({
    queryKey: ["client", "loans", "active"],
    queryFn: async () => {
      const res = await api.get<ApiEnvelope<Loan[]>>("/client/loans/active");
      return res.data.data;
    },
  });
}

export function useClientLoanDetail(id: string | null) {
  return useQuery({
    queryKey: ["client", "loans", id],
    queryFn: async () => {
      const res = await api.get<ApiEnvelope<Loan>>(`/client/loans/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useClientPayments() {
  return useQuery({
    queryKey: ["client", "payments"],
    queryFn: async () => {
      const res = await api.get<
        ApiEnvelope<{ payments: Payment[]; meta: PaginationMeta }>
      >("/payments");
      return res.data.data;
    },
  });
}

export function useApplyForLoan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      amount_requested: number;
      duration_days: number;
    }) => {
      const res = await api.post<ApiEnvelope<LoanApplication>>(
        "/client/loans",
        payload
      );
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client", "loans"] });
    },
  });
}
