"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { StatCardsSkeleton } from "@/components/skeletons";
import { useAgentDashboard } from "@/hooks/use-agent";
import { formatCurrency } from "@/lib/format";

export default function AgentDashboardPage() {
  const { data, isLoading, isError } = useAgentDashboard();

  if (isLoading) {
    return <StatCardsSkeleton count={8} />;
  }

  if (isError || !data) {
    return (
      <p className="text-sm text-destructive">
        Couldn&apos;t load dashboard stats. Is the Laravel API running?
      </p>
    );
  }

  const cards = [
    { label: "My Clients", value: data.total_clients },
    { label: "Total Loans", value: data.total_loans },
    { label: "Active Loans", value: data.active_loans },
    {
      label: "Portfolio Value",
      value: formatCurrency(data.total_portfolio_value),
    },
    {
      label: "Total Collections",
      value: formatCurrency(data.total_collections),
    },
    {
      label: "Earned Commissions",
      value: formatCurrency(data.earned_commissions),
    },
    {
      label: "Paid Commissions",
      value: formatCurrency(data.paid_commissions),
    },
    {
      label: "Pending Commissions",
      value: formatCurrency(data.pending_commissions),
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
