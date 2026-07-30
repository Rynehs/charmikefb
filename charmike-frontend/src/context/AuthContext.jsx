import { createContext, useContext, useEffect, useState } from "react";

import authService from "@/services/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const currentUser = authService.getCurrentUser();

    if (currentUser) {
      setUser(currentUser);
    }

    setLoading(false);

  }, []);

  async function login(role, phone, password) {

    const result = await authService.login(role, phone, password);

    if (result.success) {
      setUser(result.user);
    }

    return result;
  }

  function logout() {

    authService.logout();

    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );

}

export function useAuth() {
  return useContext(AuthContext);
}