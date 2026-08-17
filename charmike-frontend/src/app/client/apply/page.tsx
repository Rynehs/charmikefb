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
import { useApplyForLoan } from "@/hooks/use-client";

export default function ApplyForLoanPage() {
  const router = useRouter();
  const applyForLoan = useApplyForLoan();

  const [amount, setAmount] = useState("");
  const [duration, setDuration] = useState("30");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      await applyForLoan.mutateAsync({
        amount_requested: parseFloat(amount),
        duration_days: parseInt(duration, 10),
      });
      setSuccess(true);
      setTimeout(() => router.push("/client/loans"), 1200);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Could not submit application. Please try again.";
      setError(message);
    }
  }

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <CardTitle>Apply for a loan</CardTitle>
        <CardDescription>
          You can only have one active loan at a time.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount requested (KES)</Label>
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
            <Label htmlFor="duration">Duration (days)</Label>
            <Input
              id="duration"
              type="number"
              min={1}
              max={365}
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
          {success && (
            <p className="text-sm text-emerald-600">
              Application submitted — redirecting...
            </p>
          )}
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full"
            disabled={applyForLoan.isPending}
          >
            {applyForLoan.isPending ? "Submitting..." : "Submit application"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
