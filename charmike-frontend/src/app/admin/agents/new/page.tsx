"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { useCreateAgent } from "@/hooks/use-admin";

interface FormState {
  full_name: string;
  phone: string;
  email: string;
  password: string;
}

const INITIAL: FormState = {
  full_name: "",
  phone: "",
  email: "",
  password: "",
};

export default function NewAgentPage() {
  const router = useRouter();
  const createAgent = useCreateAgent();

  const [form, setForm] = useState<FormState>(INITIAL);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  function update(name: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setGeneralError(null);
    setFieldErrors({});

    try {
      await createAgent.mutateAsync({
        full_name: form.full_name,
        phone: form.phone,
        email: form.email || undefined,
        password: form.password,
      });
      router.push("/admin/agents");
    } catch (err: unknown) {
      const response = (
        err as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } }
      )?.response;
      if (response?.data?.errors) {
        const flat: Record<string, string> = {};
        for (const key of Object.keys(response.data.errors)) {
          flat[key] = response.data.errors[key][0];
        }
        setFieldErrors(flat);
      }
      setGeneralError(response?.data?.message || "Could not create agent.");
    }
  }

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <CardTitle>New agent</CardTitle>
        <CardDescription>
          Agent code is generated automatically.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="full_name">Full name</Label>
            <Input
              id="full_name"
              value={form.full_name}
              onChange={(e) => update("full_name", e.target.value)}
              required
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
              onChange={(e) => update("phone", e.target.value)}
              required
            />
            {fieldErrors.phone && (
              <p className="text-xs text-destructive">{fieldErrors.phone}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email (optional)</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
            />
            {fieldErrors.email && (
              <p className="text-xs text-destructive">{fieldErrors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              required
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
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full"
            disabled={createAgent.isPending}
          >
            {createAgent.isPending ? "Creating..." : "Create agent"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
