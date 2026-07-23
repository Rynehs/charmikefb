import { createContext, useContext, useEffect, useState } from "react";
import * as authService from "../api/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }

    setLoading(false);
  }, [token]);

  const login = async (role, credentials) => {
    const response = await authService.login(role, credentials);

    const token = response.data.token;
    const user = response.data.user;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("role", user.role);

    setToken(token);
    setUser(user);

    return user;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error(error);
    }

    localStorage.clear();

    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        authenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;