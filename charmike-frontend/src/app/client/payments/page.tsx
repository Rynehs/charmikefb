"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useClientPayments } from "@/hooks/use-client";
import { formatCurrency, formatDate } from "@/lib/format";

export default function ClientPaymentsPage() {
  const { data, isLoading, isError } = useClientPayments();

  if (isLoading) {
    return (
      <p className="text-sm text-muted-foreground">Loading payments...</p>
    );
  }

  if (isError || !data) {
    return (
      <p className="text-sm text-destructive">Couldn&apos;t load payments.</p>
    );
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Reference</TableHead>
            <TableHead>Loan principal</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.payments.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell>{formatDate(payment.payment_date)}</TableCell>
              <TableCell className="font-medium">
                {formatCurrency(payment.amount)}
              </TableCell>
              <TableCell>{payment.reference}</TableCell>
              <TableCell>
                {payment.loan ? formatCurrency(payment.loan.principal) : "—"}
              </TableCell>
            </TableRow>
          ))}
          {data.payments.length === 0 && (
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
  );
}
