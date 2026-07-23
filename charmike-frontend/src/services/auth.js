import api from "./axios";

export const login = async (role, credentials) => {
  const { data } = await api.post(`/${role}/login`, credentials);
  return data;
};

export const logout = async () => {
  const { data } = await api.post("/logout");
  return data;
};