import { BrowserRouter, Routes, Route } from "react-router-dom";
import ComponentPreview from "../pages/dev/ComponentPreview";
import Playground from "../pages/dev/Playground";
import ApiTest from "../pages/dev/ApiTest";
import AdminDashboard from "../pages/admin/Dashboard";
import AgentDashboard from "../pages/agent/Dashboard";
import ClientDashboard from "../pages/client/Dashboard";

import ProtectedRoute from "./ProtectedRoute";

export default function DevRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/dev/components"
          element={<ComponentPreview />}
        />
        <Route
          path="/dev/api"
          element={<ApiTest />}
        />

        <Route
          path="/dev/playground"
          element={<Playground />}
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/agent"
          element={
            <ProtectedRoute allowedRoles={["agent"]}>
              <AgentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/client"
          element={
            <ProtectedRoute allowedRoles={["client"]}>
              <ClientDashboard />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}