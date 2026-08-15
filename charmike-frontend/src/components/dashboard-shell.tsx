"use client";

import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useSession } from "@/hooks/use-session";

export function DashboardShell({
  roleLabel,
  children,
}: {
  roleLabel: string;
  children?: React.ReactNode;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session, isLoading } = useSession();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    queryClient.setQueryData(["session"], null);
    router.push("/login");
  }

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">{roleLabel} Dashboard</h1>
            {!isLoading && session?.user && (
              <p className="text-sm text-muted-foreground">
                Signed in as{" "}
                {session.user.full_name ||
                  session.user.name ||
                  session.user.phone}
              </p>
            )}
          </div>
          <Button variant="outline" onClick={handleLogout}>
            Log out
          </Button>
        </div>
        {children}
      </div>
    </main>
  );
}
