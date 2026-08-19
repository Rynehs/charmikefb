"use client";

import { Badge } from "@/components/ui/badge";
import { TableSkeleton } from "@/components/skeletons";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAgentCommissions } from "@/hooks/use-agent";
import { formatCurrency } from "@/lib/format";

const MONTHS = [
  "",
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function AgentCommissionsPage() {
  const { data, isLoading, isError } = useAgentCommissions();

  if (isLoading) {
    return <TableSkeleton rows={5} cols={6} />;
  }

  if (isError || !data) {
    return (
      <p className="text-sm text-destructive">
        Couldn&apos;t load commissions.
      </p>
    );
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Client</TableHead>
            <TableHead>Loan Principal</TableHead>
            <TableHead>Rate</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Period</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.commissions.map((c) => (
            <TableRow key={c.id}>
              <TableCell className="font-medium">
                {c.loan.client.user.full_name}
              </TableCell>
              <TableCell>{formatCurrency(c.loan.principal)}</TableCell>
              <TableCell>{parseFloat(c.rate)}%</TableCell>
              <TableCell>{formatCurrency(c.amount)}</TableCell>
              <TableCell>
                {MONTHS[c.month]} {c.year}
              </TableCell>
              <TableCell>
                <Badge variant={c.status === "paid" ? "success" : "secondary"}>
                  {c.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
          {data.commissions.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center text-muted-foreground"
              >
                No commissions yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
