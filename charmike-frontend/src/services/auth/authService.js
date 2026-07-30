import api from "@/lib/axios";
import {
  setToken,
  setUser,
  getUser,
  getToken,
  clearSession,
} from "@/lib/storage";

const endpoints = {
  admin: "/admin/login",
  agent: "/agent/login",
  client: "/client/login",
};

class AuthService {
  /**
   * Login user
   */
  async login(role, phone, password) {
    try {
      const response = await api.post(
        endpoints[role],
        {
          phone,
          password,
        }
      );

      const { success, message, data } = response.data;

      if (!success) {
        return {
          success: false,
          message,
        };
      }

      const token = data.token;
      const user = data.user;

      setToken(token);
      setUser(user);

      return {
        success: true,
        message,
        token,
        user,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Unable to connect to the server.",
        errors: error.response?.data?.errors || null,
      };
    }
  }

  /**
   * Logout user
   */
  logout() {
    clearSession();

    return {
      success: true,
    };
  }

  /**
   * Current authenticated user
   */
  getCurrentUser() {
    return getUser();
  }

  /**
   * Authentication status
   */
  isAuthenticated() {
    return !!getToken();
  }
}

export default new AuthService();