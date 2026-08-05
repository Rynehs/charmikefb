import DashboardLayout from "@/layouts/DashboardLayout";

export default function AgentDashboard() {
  return (
    <DashboardLayout title="Agent Dashboard">

      <div className="space-y-6">

        <h2 className="text-3xl font-bold">
          Welcome Agent
        </h2>

        <p className="text-gray-600">
          Register clients and manage loan requests.
        </p>

      </div>

    </DashboardLayout>
  );
}