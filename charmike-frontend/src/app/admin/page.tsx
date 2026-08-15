"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useDashboardStats } from "@/hooks/use-admin";
import { formatCurrency } from "@/lib/format";

export default function AdminDashboardPage() {
  const { data, isLoading, isError } = useDashboardStats();

  if (isLoading) {
    return (
      <p className="text-sm text-muted-foreground">Loading dashboard...</p>
    );
  }

  if (isError || !data) {
    return (
      <p className="text-sm text-destructive">
        Couldn&apos;t load dashboard stats. Is the Laravel API running?
      </p>
    );
  }

  const cards = [
    { label: "Total Clients", value: data.total_clients },
    { label: "Total Agents", value: data.total_agents },
    { label: "Total Loans", value: data.total_loans },
    { label: "Active Loans", value: data.active_loans },
    { label: "Completed Loans", value: data.completed_loans },
    { label: "Defaulted Loans", value: data.defaulted_loans },
    {
      label: "Principal Disbursed",
      value: formatCurrency(data.total_principal_disbursed),
    },
    {
      label: "Repayments Collected",
      value: formatCurrency(data.total_repayments_collected),
    },
    {
      label: "Outstanding Balance",
      value: formatCurrency(data.outstanding_balance),
    },
    {
      label: "Total Commissions",
      value: formatCurrency(data.total_commissions),
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.label}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{card.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
