"use client";

import { useState, type FormEvent } from "react";
import { useParams } from "next/navigation";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAdminLoanDetail } from "@/hooks/use-admin";
import { DetailCardSkeleton, TableSkeleton } from "@/components/skeletons";
import { useRecordPayment } from "@/hooks/use-payments";
import { formatCurrency, formatDate } from "@/lib/format";

const STATUS_VARIANT: Record<string, NonNullable<BadgeProps["variant"]>> = {
  active: "success",
  completed: "secondary",
  defaulted: "destructive",
  approved: "default",
};

function RecordPaymentForm({ loanId }: { loanId: string }) {
  const recordPayment = useRecordPayment();
  const [amount, setAmount] = useState("");
  const [reference, setReference] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    try {
      await recordPayment.mutateAsync({
        loan_id: loanId,
        amount: parseFloat(amount),
        reference,
        notes: notes || undefined,
      });
      setSuccess(true);
      setAmount("");
      setReference("");
      setNotes("");
    } catch (err: unknown) {
      const response = (
        err as { response?: { data?: { message?: string } } }
      )?.response;
      setError(response?.data?.message || "Could not record payment.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3 sm:grid-cols-4 sm:items-end">
      <div className="space-y-2">
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          type="number"
          min={1}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="reference">Reference</Label>
        <Input
          id="reference"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          placeholder="MPESA123456"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="notes">Notes (optional)</Label>
        <Input
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>
      <Button type="submit" disabled={recordPayment.isPending}>
        {recordPayment.isPending ? "Recording..." : "Record payment"}
      </Button>
      {error && (
        <p className="sm:col-span-4 text-sm text-destructive">{error}</p>
      )}
      {success && (
        <p className="sm:col-span-4 text-sm text-emerald-600">
          Payment recorded.
        </p>
      )}
    </form>
  );
}

export default function AdminLoanDetailPage() {
  const params = useParams<{ id: string }>();
  const { data: loan, isLoading, isError } = useAdminLoanDetail(params.id);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <DetailCardSkeleton fields={8} />
        <TableSkeleton rows={3} cols={5} />
      </div>
    );
  }

  if (isError || !loan) {
    return <p className="text-sm text-destructive">Couldn&apos;t load this loan.</p>;
  }

  const summary = [
    { label: "Client", value: loan.client.user.full_name },
    { label: "Agent", value: loan.agent.user.full_name },
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

      {loan.commission && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Commission</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
            <div>
              <p className="text-muted-foreground">Amount</p>
              <p className="font-medium">
                {formatCurrency(loan.commission.amount)}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Rate</p>
              <p className="font-medium">
                {parseFloat(loan.commission.rate)}%
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Status</p>
              <Badge
                variant={
                  loan.commission.status === "paid" ? "success" : "secondary"
                }
              >
                {loan.commission.status}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {(loan.status === "active" || loan.status === "approved") && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Record a payment</CardTitle>
          </CardHeader>
          <CardContent>
            <RecordPaymentForm loanId={loan.id} />
          </CardContent>
        </Card>
      )}

      <div>
        <h2 className="mb-3 text-lg font-semibold">Payment history</h2>
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead>Recorded by</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(loan.payments ?? []).map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{formatDate(payment.payment_date)}</TableCell>
                  <TableCell>{formatCurrency(payment.amount)}</TableCell>
                  <TableCell>{payment.reference}</TableCell>
                  <TableCell>
                    {payment.recorded_by?.full_name ?? "—"}
                  </TableCell>
                  <TableCell>{payment.notes ?? "—"}</TableCell>
                </TableRow>
              ))}
              {(loan.payments ?? []).length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
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
