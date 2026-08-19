"use client";

import { Badge, type BadgeProps } from "@/components/ui/badge";
import { TableSkeleton } from "@/components/skeletons";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAgentLoans } from "@/hooks/use-agent";
import { formatCurrency, formatDate } from "@/lib/format";

const STATUS_VARIANT: Record<string, NonNullable<BadgeProps["variant"]>> = {
  active: "success",
  completed: "secondary",
  defaulted: "destructive",
  approved: "default",
};

export default function AgentLoansPage() {
  const { data, isLoading, isError } = useAgentLoans();

  if (isLoading) {
    return <TableSkeleton rows={5} cols={5} />;
  }

  if (isError || !data) {
    return <p className="text-sm text-destructive">Couldn&apos;t load loans.</p>;
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Client</TableHead>
            <TableHead>Principal</TableHead>
            <TableHead>Balance</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Due date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.loans.map((loan) => (
            <TableRow key={loan.id}>
              <TableCell className="font-medium">
                {loan.client.user.full_name}
              </TableCell>
              <TableCell>{formatCurrency(loan.principal)}</TableCell>
              <TableCell>{formatCurrency(loan.balance)}</TableCell>
              <TableCell>
                <Badge variant={STATUS_VARIANT[loan.status] ?? "outline"}>
                  {loan.status}
                </Badge>
              </TableCell>
              <TableCell>{formatDate(loan.due_date)}</TableCell>
            </TableRow>
          ))}
          {data.loans.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center text-muted-foreground"
              >
                No loans in your portfolio yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
