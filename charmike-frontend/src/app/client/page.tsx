import { DashboardShell } from "@/components/dashboard-shell";

export default function ClientDashboardPage() {
  return (
    <DashboardShell roleLabel="Client">
      <p className="text-sm text-muted-foreground">
        Protected route working — client data views come in the next step.
      </p>
    </DashboardShell>
  );
}
