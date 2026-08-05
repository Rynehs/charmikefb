import DashboardLayout from "@/layouts/DashboardLayout";
import useDashboard from "@/hooks/useDashboard";

import {
  PageHeader,
  StatCard,
  QuickActionCard,
  SectionCard,
  RecentActivityTable,
} from "@/components/dashboard";

import {
  Users,
  Wallet,
  CreditCard,
  TrendingUp,
  UserPlus,
  FilePlus,
  ClipboardList,
  BarChart3,
} from "lucide-react";

export default function AdminDashboard() {
  const { data, loading, error } = useDashboard();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <DashboardLayout title="Dashboard">
        <p className="text-red-500">{error}</p>
      </DashboardLayout>
    );
  }

  const stats = data.statistics;

  return (
    <DashboardLayout title="Administrator Dashboard">

      <PageHeader
        title="Dashboard"
        subtitle="Welcome back. Here's what's happening today."
      />

      {/* Statistics */}

      <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Clients"
          value={stats.clients}
          icon={Users}
        />

        <StatCard
          title="Active Loans"
          value={stats.active_loans}
          icon={Wallet}
        />

        <StatCard
          title="Amount Collected"
          value={`KES ${Number(stats.amount_collected).toLocaleString()}`}
          icon={CreditCard}
        />

        <StatCard
          title="Outstanding Balance"
          value={`KES ${Number(stats.outstanding_balance).toLocaleString()}`}
          icon={TrendingUp}
        />

      </div>

      {/* Quick Actions */}

      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        <QuickActionCard
          title="Add Agent"
          description="Register a new loan agent."
          icon={UserPlus}
        />

        <QuickActionCard
          title="New Loan"
          description="Review pending applications."
          icon={FilePlus}
        />

        <QuickActionCard
          title="Reports"
          description="View business reports."
          icon={BarChart3}
        />

        <QuickActionCard
          title="Clients"
          description="Manage registered clients."
          icon={ClipboardList}
        />

      </div>

      {/* Tables */}

      <div className="mt-8 grid gap-6 xl:grid-cols-2">

        <SectionCard title="Recent Loans">

          <RecentActivityTable
            type="loans"
            data={data.recent_loans}
          />

        </SectionCard>

        <SectionCard title="Recent Payments">

          <RecentActivityTable
            type="payments"
            data={data.recent_payments}
          />

        </SectionCard>

      </div>

    </DashboardLayout>
  );
}