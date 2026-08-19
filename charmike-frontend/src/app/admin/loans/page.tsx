"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/pagination";
import { TableSkeleton } from "@/components/skeletons";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDisburseLoan, useLoans } from "@/hooks/use-admin";
import { formatCurrency, formatDate } from "@/lib/format";

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "All statuses" },
  { value: "approved", label: "Approved (awaiting disbursement)" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
  { value: "defaulted", label: "Defaulted" },
];

const STATUS_VARIANT: Record<string, NonNullable<BadgeProps["variant"]>> = {
  active: "success",
  completed: "secondary",
  defaulted: "destructive",
  approved: "default",
};

function DisburseAction({ loanId }: { loanId: string }) {
  const [open, setOpen] = useState(false);
  const [reference, setReference] = useState("");
  const disburse = useDisburseLoan();

  if (!open) {
    return (
      <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
        Disburse (record M-Pesa code)
      </Button>
    );
  }

  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground">
        Send funds to the client manually, then record the code:
      </p>
      <div className="flex items-center justify-end gap-2">
        <Input
          placeholder="M-Pesa transaction code"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          className="h-8 w-40"
        />
        <Button
          size="sm"
          disabled={!reference || disburse.isPending}
          onClick={() =>
            disburse.mutate(
              { id: loanId, reference },
              { onSuccess: () => setOpen(false) }
            )
          }
        >
          {disburse.isPending ? "..." : "Confirm"}
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>
          Cancel
        </Button>
      </div>
    </div>
  );
}

export default function AdminLoansPage() {
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useLoans(status || undefined, page);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <label className="text-sm text-muted-foreground">Filter:</label>
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {isLoading && <TableSkeleton rows={5} cols={7} />}
      {isError && (
        <p className="text-sm text-destructive">Couldn&apos;t load loans.</p>
      )}

      {data && (
        <>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Agent</TableHead>
                  <TableHead>Principal</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Due date</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.loans.map((loan) => (
                  <TableRow key={loan.id}>
                    <TableCell>
                      <Link
                        href={`/admin/loans/${loan.id}`}
                        className="font-medium text-primary underline"
                      >
                        {loan.client.user.full_name}
                      </Link>
                    </TableCell>
                    <TableCell>{loan.agent.user.full_name}</TableCell>
                    <TableCell>{formatCurrency(loan.principal)}</TableCell>
                    <TableCell>{formatCurrency(loan.balance)}</TableCell>
                    <TableCell>
                      <Badge variant={STATUS_VARIANT[loan.status] ?? "outline"}>
                        {loan.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(loan.due_date)}</TableCell>
                    <TableCell className="text-right">
                      {loan.status === "approved" && (
                        <DisburseAction loanId={loan.id} />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {data.loans.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center text-muted-foreground"
                    >
                      No loans found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <Pagination meta={data.meta} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
