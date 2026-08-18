"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  useAgentDetail,
  useDeleteAgent,
  useToggleAgentActive,
  useUpdateAgent,
} from "@/hooks/use-admin";
import { formatDate } from "@/lib/format";

export default function AgentDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data: agent, isLoading, isError } = useAgentDetail(params.id);
  const updateAgent = useUpdateAgent();
  const toggleActive = useToggleAgentActive();
  const deleteAgent = useDeleteAgent();

  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    email: "",
    password: "",
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);

  useEffect(() => {
    if (agent) {
      setForm({
        full_name: agent.user.full_name,
        phone: agent.user.phone,
        email: agent.user.email ?? "",
        password: "",
      });
    }
  }, [agent]);

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading agent...</p>;
  }

  if (isError || !agent) {
    return <p className="text-sm text-destructive">Couldn&apos;t load agent.</p>;
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setGeneralError(null);
    setFieldErrors({});
    setSavedMsg(null);

    const payload: Record<string, string> = {
      full_name: form.full_name,
      phone: form.phone,
      email: form.email,
    };
    if (form.password) payload.password = form.password;

    try {
      await updateAgent.mutateAsync({ id: agent.id, payload });
      setSavedMsg("Saved.");
      setForm((prev) => ({ ...prev, password: "" }));
    } catch (err: unknown) {
      const response = (
        err as {
          response?: {
            data?: { message?: string; errors?: Record<string, string[]> };
          };
        }
      )?.response;
      if (response?.data?.errors) {
        const flat: Record<string, string> = {};
        for (const key of Object.keys(response.data.errors)) {
          flat[key] = response.data.errors[key][0];
        }
        setFieldErrors(flat);
      }
      setGeneralError(response?.data?.message || "Could not save changes.");
    }
  }

  async function handleDelete() {
    if (!window.confirm(`Delete agent ${agent.agent_code}? This cannot be undone.`)) {
      return;
    }
    try {
      await deleteAgent.mutateAsync(agent.id);
      router.push("/admin/agents");
    } catch (err: unknown) {
      const response = (
        err as { response?: { data?: { message?: string } } }
      )?.response;
      window.alert(response?.data?.message || "Could not delete agent.");
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              {agent.agent_code} — {agent.user.full_name}
            </CardTitle>
            <Badge variant={agent.is_active ? "success" : "secondary"}>
              {agent.is_active ? "Active" : "Inactive"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
          <div>
            <p className="text-muted-foreground">Clients</p>
            <p className="font-medium">{agent.clients_count ?? "—"}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Loans</p>
            <p className="font-medium">{agent.loans_count ?? "—"}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Joined</p>
            <p className="font-medium">{formatDate(agent.created_at)}</p>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button
          variant="outline"
          disabled={toggleActive.isPending}
          onClick={() =>
            toggleActive.mutate({ id: agent.id, activate: !agent.is_active })
          }
        >
          {agent.is_active ? "Deactivate" : "Activate"}
        </Button>
        <Button
          variant="destructive"
          disabled={deleteAgent.isPending}
          onClick={handleDelete}
        >
          Delete agent
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Edit details</CardTitle>
        </CardHeader>
        <form onSubmit={handleSave}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full name</Label>
              <Input
                id="full_name"
                value={form.full_name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, full_name: e.target.value }))
                }
              />
              {fieldErrors.full_name && (
                <p className="text-xs text-destructive">
                  {fieldErrors.full_name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={form.phone}
                onChange={(e) =>
                  setForm((p) => ({ ...p, phone: e.target.value }))
                }
              />
              {fieldErrors.phone && (
                <p className="text-xs text-destructive">
                  {fieldErrors.phone}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm((p) => ({ ...p, email: e.target.value }))
                }
              />
              {fieldErrors.email && (
                <p className="text-xs text-destructive">
                  {fieldErrors.email}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">New password (optional)</Label>
              <Input
                id="password"
                type="password"
                value={form.password}
                onChange={(e) =>
                  setForm((p) => ({ ...p, password: e.target.value }))
                }
                placeholder="Leave blank to keep current password"
                minLength={8}
              />
              {fieldErrors.password && (
                <p className="text-xs text-destructive">
                  {fieldErrors.password}
                </p>
              )}
            </div>

            {generalError && (
              <p className="text-sm text-destructive">{generalError}</p>
            )}
            {savedMsg && (
              <p className="text-sm text-emerald-600">{savedMsg}</p>
            )}
          </CardContent>
          <CardContent className="pt-0">
            <Button type="submit" disabled={updateAgent.isPending}>
              {updateAgent.isPending ? "Saving..." : "Save changes"}
            </Button>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
