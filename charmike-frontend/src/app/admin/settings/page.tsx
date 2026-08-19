"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { DetailCardSkeleton } from "@/components/skeletons";
import { useSettings, useUpdateSettings } from "@/hooks/use-admin";

const FIELDS: { key: string; label: string; suffix?: string }[] = [
  { key: "commission_rate", label: "Agent commission rate", suffix: "%" },
  { key: "default_interest_rate", label: "Default loan interest rate", suffix: "%" },
  { key: "max_active_loans", label: "Max active loans per client" },
];

export default function AdminSettingsPage() {
  const { data, isLoading, isError } = useSettings();
  const updateSettings = useUpdateSettings();

  const [values, setValues] = useState<Record<string, string>>({});
  const [savedMsg, setSavedMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (data) setValues(data);
  }, [data]);

  if (isLoading) {
    return <DetailCardSkeleton fields={3} />;
  }

  if (isError || !data) {
    return <p className="text-sm text-destructive">Couldn&apos;t load settings.</p>;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSavedMsg(null);
    setError(null);

    const payload = FIELDS.map((f) => ({
      key: f.key,
      value: values[f.key] ?? "",
    }));

    try {
      await updateSettings.mutateAsync(payload);
      setSavedMsg("Settings updated.");
    } catch (err: unknown) {
      const response = (
        err as { response?: { data?: { message?: string } } }
      )?.response;
      setError(response?.data?.message || "Could not update settings.");
    }
  }

  return (
    <Card className="max-w-lg">
      <CardHeader>
        <CardTitle>System settings</CardTitle>
        <CardDescription>
          Applies to new loans and agent registrations going forward.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {FIELDS.map((field) => (
            <div key={field.key} className="space-y-2">
              <Label htmlFor={field.key}>{field.label}</Label>
              <div className="flex items-center gap-2">
                <Input
                  id={field.key}
                  type="number"
                  step="any"
                  value={values[field.key] ?? ""}
                  onChange={(e) =>
                    setValues((prev) => ({
                      ...prev,
                      [field.key]: e.target.value,
                    }))
                  }
                  required
                />
                {field.suffix && (
                  <span className="text-sm text-muted-foreground">
                    {field.suffix}
                  </span>
                )}
              </div>
            </div>
          ))}

          {error && <p className="text-sm text-destructive">{error}</p>}
          {savedMsg && <p className="text-sm text-emerald-600">{savedMsg}</p>}
        </CardContent>
        <CardContent className="pt-0">
          <Button type="submit" disabled={updateSettings.isPending}>
            {updateSettings.isPending ? "Saving..." : "Save settings"}
          </Button>
        </CardContent>
      </form>
    </Card>
  );
}
