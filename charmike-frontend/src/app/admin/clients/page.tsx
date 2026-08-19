"use client";

import { useState } from "react";
import Link from "next/link";
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
import { useClients } from "@/hooks/use-admin";
import { formatCurrency, formatDate } from "@/lib/format";

export default function AdminClientsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const { data, isLoading, isError } = useClients({ page, search });

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search by name or phone..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        className="max-w-sm"
      />

      {isLoading && <TableSkeleton rows={5} cols={6} />}
      {isError && (
        <p className="text-sm text-destructive">Couldn&apos;t load clients.</p>
      )}

      {data && (
        <>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>National ID</TableHead>
                  <TableHead>Agent</TableHead>
                  <TableHead>Credit Limit</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.clients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>
                      <Link
                        href={`/admin/clients/${client.id}`}
                        className="font-medium text-primary underline"
                      >
                        {client.user.full_name}
                      </Link>
                    </TableCell>
                    <TableCell>{client.user.phone}</TableCell>
                    <TableCell>{client.national_id}</TableCell>
                    <TableCell>{client.agent?.user.full_name ?? "—"}</TableCell>
                    <TableCell>{formatCurrency(client.credit_limit)}</TableCell>
                    <TableCell>{formatDate(client.created_at)}</TableCell>
                  </TableRow>
                ))}
                {data.clients.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center text-muted-foreground"
                    >
                      No clients found.
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
