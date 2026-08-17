"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useSession } from "@/hooks/use-session";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/client", label: "Dashboard" },
  { href: "/client/loans", label: "My Loans" },
  { href: "/client/apply", label: "Apply" },
  { href: "/client/payments", label: "Payments" },
];

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    queryClient.setQueryData(["session"], null);
    router.push("/login");
  }

  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-sm text-muted-foreground">
              Charmike Investments
            </p>
            <h1 className="text-lg font-semibold">
              {session?.user?.full_name || session?.user?.name || "Client"}
            </h1>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            Log out
          </Button>
        </div>
        <nav className="mx-auto flex max-w-4xl gap-1 px-6 pb-2">
          {NAV.map((item) => {
            const active =
              item.href === "/client"
                ? pathname === "/client"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>
      <main className="mx-auto max-w-4xl px-6 py-8">{children}</main>
    </div>
  );
}
