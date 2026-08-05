import { useEffect, useState } from "react";
import dashboardService from "@/services/dashboardService";

export default function useDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadDashboard() {
    setLoading(true);

    const result =
      await dashboardService.getAdminDashboard();

    if (result.success) {
      setData(result.data);
      setError("");
    } else {
      setError(result.message);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  return {
    data,
    loading,
    error,
    refresh: loadDashboard,
  };
}