"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import type { ApiEnvelope, Payment } from "@/types/api";

export function useRecordPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      loan_id: string;
      amount: number;
      reference: string;
      notes?: string;
    }) => {
      const res = await api.post<ApiEnvelope<Payment>>("/payments", payload);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "loans"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["agent", "loans"] });
      queryClient.invalidateQueries({ queryKey: ["agent", "dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
  });
}
