"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DetailCardSkeleton, TableSkeleton } from "@/components/skeletons";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useClientDetail } from "@/hooks/use-admin";
import { formatCurrency, formatDate } from "@/lib/format";

const STATUS_VARIANT: Record<string, NonNullable<BadgeProps["variant"]>> = {
  active: "success",
  completed: "secondary",
  defaulted: "destructive",
  approved: "default",
};

export default function AdminClientDetailPage() {
  const params = useParams<{ id: string }>();
  const { data: client, isLoading, isError } = useClientDetail(params.id);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <DetailCardSkeleton fields={4} />
        <TableSkeleton rows={3} cols={5} />
      </div>
    );
  }

  if (isError || !client) {
    return <p className="text-sm text-destructive">Couldn&apos;t load client.</p>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{client.user.full_name}</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
          <div>
            <p className="text-muted-foreground">Phone</p>
            <p className="font-medium">{client.user.phone}</p>
          </div>
          <div>
            <p className="text-muted-foreground">National ID</p>
            <p className="font-medium">{client.national_id}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Credit limit</p>
            <p className="font-medium">
              {formatCurrency(client.credit_limit)}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Agent</p>
            <p className="font-medium">
              {client.agent?.user.full_name ?? "—"}
            </p>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="mb-3 text-lg font-semibold">Loans</h2>
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Principal</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Due date</TableHead>
                <TableHead className="text-right">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(client.loans ?? []).map((loan) => (
                <TableRow key={loan.id}>
                  <TableCell>{formatCurrency(loan.principal)}</TableCell>
                  <TableCell>{formatCurrency(loan.balance)}</TableCell>
                  <TableCell>
                    <Badge variant={STATUS_VARIANT[loan.status] ?? "outline"}>
                      {loan.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(loan.due_date)}</TableCell>
                  <TableCell className="text-right">
                    <Link
                      href={`/admin/loans/${loan.id}`}
                      className="text-sm text-primary underline"
                    >
                      View
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
              {(client.loans ?? []).length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-muted-foreground"
                  >
                    No loans yet.
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
