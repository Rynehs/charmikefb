import {
  LayoutDashboard,
  Users,
  Wallet,
  CreditCard,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";

import NavItem from "../NavItem";

export default function Sidebar() {
  return (
    <aside className="flex h-screen w-72 flex-col bg-white shadow-lg">

      {/* Logo */}

      <div className="border-b p-6">

        <h1 className="text-2xl font-bold text-emerald-600">
          Charmike
        </h1>

        <p className="text-sm text-gray-500">
          Loan Management
        </p>

      </div>

      {/* Navigation */}

      <nav className="flex-1 space-y-2 p-4">

        <NavItem
          icon={LayoutDashboard}
          label="Dashboard"
        />

        <NavItem
          icon={Users}
          label="Clients"
        />

        <NavItem
          icon={Wallet}
          label="Loans"
        />

        <NavItem
          icon={CreditCard}
          label="Payments"
        />

        <NavItem
          icon={BarChart3}
          label="Reports"
        />

        <NavItem
          icon={Settings}
          label="Settings"
        />

      </nav>

      {/* Footer */}

      <div className="border-t p-4">

        <NavItem
          icon={LogOut}
          label="Logout"
        />

      </div>

    </aside>
  );
}