import DashboardLayout from "@/layouts/DashboardLayout";

export default function ClientDashboard() {
  return (
    <DashboardLayout title="Client Dashboard">

      <div className="space-y-6">

        <h2 className="text-3xl font-bold">
          Welcome
        </h2>

        <p className="text-gray-600">
          View your loan account and payment history.
        </p>

      </div>

    </DashboardLayout>
  );
}