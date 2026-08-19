"use client";

import { TableSkeleton } from "@/components/skeletons";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAgentClients } from "@/hooks/use-agent";
import { formatCurrency, formatDate } from "@/lib/format";

export default function AgentClientsPage() {
  const { data, isLoading, isError } = useAgentClients();

  if (isLoading) {
    return <TableSkeleton rows={5} cols={5} />;
  }

  if (isError || !data) {
    return <p className="text-sm text-destructive">Couldn&apos;t load clients.</p>;
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>National ID</TableHead>
            <TableHead>Credit Limit</TableHead>
            <TableHead>Joined</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.clients.map((client) => (
            <TableRow key={client.id}>
              <TableCell className="font-medium">
                {client.user.full_name}
              </TableCell>
              <TableCell>{client.user.phone}</TableCell>
              <TableCell>{client.national_id}</TableCell>
              <TableCell>{formatCurrency(client.credit_limit)}</TableCell>
              <TableCell>{formatDate(client.created_at)}</TableCell>
            </TableRow>
          ))}
          {data.clients.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center text-muted-foreground"
              >
                No clients yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
