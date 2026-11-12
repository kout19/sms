import apiAxios from "@shared/api/axios";

const BASE = "/admin";

export const getAdminOverview = async ({ signal } = {}) => {
  const response = await apiAxios.get(`${BASE}/overview`, { signal });
  return response.data.data;
};
