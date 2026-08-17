"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
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

interface FormState {
  full_name: string;
  phone: string;
  email: string;
  national_id: string;
  agent_code: string;
  password: string;
  password_confirmation: string;
}

const INITIAL_STATE: FormState = {
  full_name: "",
  phone: "",
  email: "",
  national_id: "",
  agent_code: "",
  password: "",
  password_confirmation: "",
};

const FIELDS: { name: keyof FormState; label: string; type?: string }[] = [
  { name: "full_name", label: "Full name" },
  { name: "phone", label: "Phone", type: "tel" },
  { name: "email", label: "Email (optional)", type: "email" },
  { name: "national_id", label: "National ID" },
  { name: "agent_code", label: "Agent code" },
  { name: "password", label: "Password", type: "password" },
  {
    name: "password_confirmation",
    label: "Confirm password",
    type: "password",
  },
];

export default function RegisterPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function updateField(name: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setGeneralError(null);
    setFieldErrors({});
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          email: form.email || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data?.errors) {
          const flat: Record<string, string> = {};
          for (const key of Object.keys(data.errors)) {
            flat[key] = Array.isArray(data.errors[key])
              ? data.errors[key][0]
              : String(data.errors[key]);
          }
          setFieldErrors(flat);
        }
        setGeneralError(data?.message || "Registration failed");
        setLoading(false);
        return;
      }

      await queryClient.invalidateQueries({ queryKey: ["session"] });
      router.push("/client");
    } catch {
      setGeneralError("Something went wrong. Is the Laravel API running?");
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create a client account</CardTitle>
          <CardDescription>
            Charmike Investments — you&apos;ll need an agent code to register
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {FIELDS.map((field) => (
              <div key={field.name} className="space-y-2">
                <Label htmlFor={field.name}>{field.label}</Label>
                <Input
                  id={field.name}
                  type={field.type || "text"}
                  value={form[field.name]}
                  onChange={(e) => updateField(field.name, e.target.value)}
                  required={field.name !== "email"}
                  aria-invalid={!!fieldErrors[field.name]}
                />
                {fieldErrors[field.name] && (
                  <p className="text-xs text-destructive">
                    {fieldErrors[field.name]}
                  </p>
                )}
              </div>
            ))}

            {generalError && (
              <p className="text-sm text-destructive">{generalError}</p>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account..." : "Create account"}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
}
