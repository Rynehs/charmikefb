"use client";

import { useParams } from "next/navigation";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useClientLoanDetail } from "@/hooks/use-client";
import { DetailCardSkeleton, TableSkeleton } from "@/components/skeletons";
import { formatCurrency, formatDate } from "@/lib/format";

const STATUS_VARIANT: Record<string, NonNullable<BadgeProps["variant"]>> = {
  active: "success",
  completed: "secondary",
  defaulted: "destructive",
  approved: "default",
};

export default function ClientLoanDetailPage() {
  const params = useParams<{ id: string }>();
  const { data: loan, isLoading, isError } = useClientLoanDetail(params.id);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <DetailCardSkeleton fields={8} />
        <TableSkeleton rows={3} cols={4} />
      </div>
    );
  }

  if (isError || !loan) {
    return <p className="text-sm text-destructive">Couldn&apos;t load this loan.</p>;
  }

  const summary = [
    { label: "Principal", value: formatCurrency(loan.principal) },
    { label: "Interest rate", value: `${parseFloat(loan.interest_rate)}%` },
    { label: "Interest amount", value: formatCurrency(loan.interest_amount) },
    { label: "Total due", value: formatCurrency(loan.total_due) },
    { label: "Amount paid", value: formatCurrency(loan.amount_paid) },
    { label: "Balance", value: formatCurrency(loan.balance) },
    { label: "Disbursed", value: formatDate(loan.disbursed_at) },
    { label: "Due date", value: formatDate(loan.due_date) },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Loan details</CardTitle>
            <Badge variant={STATUS_VARIANT[loan.status] ?? "outline"}>
              {loan.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
          {summary.map((item) => (
            <div key={item.label}>
              <p className="text-muted-foreground">{item.label}</p>
              <p className="font-medium">{item.value}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <div>
        <h2 className="mb-3 text-lg font-semibold">Payment history</h2>
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(loan.payments ?? []).map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{formatDate(payment.payment_date)}</TableCell>
                  <TableCell>{formatCurrency(payment.amount)}</TableCell>
                  <TableCell>{payment.reference}</TableCell>
                  <TableCell>{payment.notes ?? "—"}</TableCell>
                </TableRow>
              ))}
              {(loan.payments ?? []).length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center text-muted-foreground"
                  >
                    No payments recorded yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
