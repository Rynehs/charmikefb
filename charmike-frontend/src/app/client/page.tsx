"use client";

import Link from "next/link";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { useClientActiveLoans, useClientProfile } from "@/hooks/use-client";
import { DetailCardSkeleton, StatCardsSkeleton } from "@/components/skeletons";
import { formatCurrency, formatDate } from "@/lib/format";

const STATUS_VARIANT: Record<string, NonNullable<BadgeProps["variant"]>> = {
  active: "success",
  completed: "secondary",
  defaulted: "destructive",
  approved: "default",
};

export default function ClientDashboardPage() {
  const { data: profile, isLoading: profileLoading } = useClientProfile();
  const {
    data: activeLoans,
    isLoading: loansLoading,
    isError: loansError,
  } = useClientActiveLoans();

  return (
    <div className="space-y-6">
      {profileLoading && <DetailCardSkeleton fields={4} />}

      {!profileLoading && (
        <Card>
          <CardHeader>
            <CardTitle>Your profile</CardTitle>
            <CardDescription>{profile?.user.phone}</CardDescription>
          </CardHeader>
          {profile && (
            <CardContent className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
              <div>
                <p className="text-muted-foreground">National ID</p>
                <p className="font-medium">{profile.national_id}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Credit limit</p>
                <p className="font-medium">
                  {formatCurrency(profile.credit_limit)}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Agent</p>
                <p className="font-medium">
                  {profile.agent?.user.full_name ?? "—"}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Agent code</p>
                <p className="font-medium">
                  {profile.agent?.agent_code ?? "—"}
                </p>
              </div>
            </CardContent>
          )}
        </Card>
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Active loans</h2>
        <Button asChild size="sm">
          <Link href="/client/apply">Apply for a loan</Link>
        </Button>
      </div>

      {loansLoading && <StatCardsSkeleton count={2} />}
      {loansError && (
        <p className="text-sm text-destructive">Couldn&apos;t load loans.</p>
      )}

      {activeLoans && activeLoans.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-sm text-muted-foreground">
            No active loans right now. Apply for one to get started.
          </CardContent>
        </Card>
      )}

      {activeLoans && activeLoans.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {activeLoans.map((loan) => (
            <Link key={loan.id} href={`/client/loans/${loan.id}`}>
              <Card className="transition-colors hover:bg-accent/50">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">
                      {formatCurrency(loan.principal)}
                    </CardTitle>
                    <Badge variant={STATUS_VARIANT[loan.status] ?? "outline"}>
                      {loan.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-1 text-sm">
                  <p className="text-muted-foreground">
                    Balance:{" "}
                    <span className="font-medium text-foreground">
                      {formatCurrency(loan.balance)}
                    </span>
                  </p>
                  <p className="text-muted-foreground">
                    Due: {formatDate(loan.due_date)}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
