"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useApproveLoan,
  usePendingApplications,
  useRejectLoan,
} from "@/hooks/use-admin";
import { formatCurrency, formatDate } from "@/lib/format";

function ApproveAction({ applicationId }: { applicationId: string }) {
  const [open, setOpen] = useState(false);
  const [rate, setRate] = useState("20");
  const approve = useApproveLoan();

  if (!open) {
    return (
      <Button size="sm" onClick={() => setOpen(true)}>
        Approve
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Input
        type="number"
        value={rate}
        onChange={(e) => setRate(e.target.value)}
        className="h-8 w-20"
      />
      <span className="text-xs text-muted-foreground">%</span>
      <Button
        size="sm"
        disabled={approve.isPending || !rate}
        onClick={() =>
          approve.mutate(
            { id: applicationId, interest_rate: parseFloat(rate) },
            { onSuccess: () => setOpen(false) }
          )
        }
      >
        {approve.isPending ? "..." : "Confirm"}
      </Button>
      <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>
        Cancel
      </Button>
    </div>
  );
}

function RejectAction({ applicationId }: { applicationId: string }) {
  const reject = useRejectLoan();

  function handleClick() {
    const reason = window.prompt("Reason for rejecting this application?");
    if (!reason) return;
    reject.mutate({ id: applicationId, reason });
  }

  return (
    <Button
      size="sm"
      variant="destructive"
      onClick={handleClick}
      disabled={reject.isPending}
    >
      Reject
    </Button>
  );
}

export default function AdminPendingLoansPage() {
  const { data, isLoading, isError } = usePendingApplications();

  if (isLoading) {
    return (
      <p className="text-sm text-muted-foreground">
        Loading applications...
      </p>
    );
  }

  if (isError || !data) {
    return (
      <p className="text-sm text-destructive">
        Couldn&apos;t load pending applications.
      </p>
    );
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Client</TableHead>
            <TableHead>Agent</TableHead>
            <TableHead>Amount requested</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Applied</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.applications.map((app) => (
            <TableRow key={app.id}>
              <TableCell>{app.client.user.full_name}</TableCell>
              <TableCell>{app.client.agent?.user.full_name ?? "—"}</TableCell>
              <TableCell>{formatCurrency(app.amount_requested)}</TableCell>
              <TableCell>{app.duration_days} days</TableCell>
              <TableCell>{formatDate(app.created_at)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <ApproveAction applicationId={app.id} />
                  <RejectAction applicationId={app.id} />
                </div>
              </TableCell>
            </TableRow>
          ))}
          {data.applications.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center text-muted-foreground"
              >
                No pending applications.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
