import api from "@/lib/axios";

class DashboardService {
  async getAdminDashboard() {
    try {
      const response = await api.get("/admin/dashboard");

      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Unable to load dashboard.",
      };
    }
  }
}

export default new DashboardService();