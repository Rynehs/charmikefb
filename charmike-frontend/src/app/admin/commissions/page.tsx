"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAdminCommissions } from "@/hooks/use-admin";
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

export default function AdminCommissionsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useAdminCommissions(page);

  if (isLoading) {
    return (
      <p className="text-sm text-muted-foreground">Loading commissions...</p>
    );
  }

  if (isError || !data) {
    return (
      <p className="text-sm text-destructive">
        Couldn&apos;t load commissions.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Agent</TableHead>
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
                  {c.loan.agent.user.full_name}
                </TableCell>
                <TableCell>{c.loan.client.user.full_name}</TableCell>
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
                  colSpan={7}
                  className="text-center text-muted-foreground"
                >
                  No commissions yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <Pagination meta={data.meta} onPageChange={setPage} />
    </div>
  );
}
