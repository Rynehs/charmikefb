"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAgents } from "@/hooks/use-admin";
import { formatDate } from "@/lib/format";

export default function AdminAgentsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useAgents(page);

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading agents...</p>;
  }

  if (isError || !data) {
    return <p className="text-sm text-destructive">Couldn&apos;t load agents.</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button asChild size="sm">
          <Link href="/admin/agents/new">New Agent</Link>
        </Button>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Clients</TableHead>
              <TableHead>Loans</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.agents.map((agent) => (
              <TableRow key={agent.id}>
                <TableCell>
                  <Link
                    href={`/admin/agents/${agent.id}`}
                    className="font-medium text-primary underline"
                  >
                    {agent.agent_code}
                  </Link>
                </TableCell>
                <TableCell>{agent.user.full_name}</TableCell>
                <TableCell>{agent.user.phone}</TableCell>
                <TableCell>{agent.clients_count ?? "—"}</TableCell>
                <TableCell>{agent.loans_count ?? "—"}</TableCell>
                <TableCell>
                  <Badge variant={agent.is_active ? "success" : "secondary"}>
                    {agent.is_active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(agent.created_at)}</TableCell>
              </TableRow>
            ))}
            {data.agents.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-muted-foreground"
                >
                  No agents yet.
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
