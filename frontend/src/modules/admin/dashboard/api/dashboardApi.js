import apiAxios from "@shared/api/axios";

const BASE = "/admin";

export const getAdminOverview = async () => {
  const response = await apiAxios.get(`${BASE}/overview`);
  return response.data.data;
};
