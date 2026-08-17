"use client";

import Link from "next/link";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useClientApplications } from "@/hooks/use-client";
import { formatCurrency, formatDate } from "@/lib/format";

const STATUS_VARIANT: Record<string, NonNullable<BadgeProps["variant"]>> = {
  pending: "default",
  approved: "default",
  active: "success",
  completed: "secondary",
  defaulted: "destructive",
  rejected: "destructive",
};

export default function ClientLoansPage() {
  const { data, isLoading, isError } = useClientApplications();

  if (isLoading) {
    return (
      <p className="text-sm text-muted-foreground">
        Loading your applications...
      </p>
    );
  }

  if (isError || !data) {
    return (
      <p className="text-sm text-destructive">
        Couldn&apos;t load your loan history.
      </p>
    );
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Amount requested</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Applied</TableHead>
            <TableHead className="text-right">Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.applications.map((app) => (
            <TableRow key={app.id}>
              <TableCell>{formatCurrency(app.amount_requested)}</TableCell>
              <TableCell>{app.duration_days} days</TableCell>
              <TableCell>
                <Badge variant={STATUS_VARIANT[app.status] ?? "outline"}>
                  {app.status}
                </Badge>
                {app.status === "rejected" && app.rejection_reason && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {app.rejection_reason}
                  </p>
                )}
              </TableCell>
              <TableCell>{formatDate(app.created_at)}</TableCell>
              <TableCell className="text-right">
                {app.loan ? (
                  <Link
                    href={`/client/loans/${app.loan.id}`}
                    className="text-sm text-primary underline"
                  >
                    View loan
                  </Link>
                ) : (
                  <span className="text-sm text-muted-foreground">—</span>
                )}
              </TableCell>
            </TableRow>
          ))}
          {data.applications.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center text-muted-foreground"
              >
                You haven&apos;t applied for any loans yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
