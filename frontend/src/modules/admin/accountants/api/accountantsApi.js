import apiAxios from "../../../../shared/api/axios";

const BASE = "/admin/accountants";

export const getAccountantOverview = async ({ signal } = {}) => {
  const response = await apiAxios.get(`${BASE}/overview`, { signal });
  return response.data.data;
};

export const getAllAccountants = async (filters = {}, { signal } = {}) => {
  const response = await apiAxios.get(BASE, { params: filters, signal });
  return response.data;
};

export const getAccountantById = async (id, { signal } = {}) => {
  const response = await apiAxios.get(`${BASE}/${id}`, { signal });
  return response.data.data;
};

export const createAccountant = async (payload) => {
  const response = await apiAxios.post(BASE, payload);
  return response.data.data;
};

export const updateAccountant = async ({ id, payload }) => {
  const response = await apiAxios.patch(`${BASE}/${id}`, payload);
  return response.data.data;
};

export const setAccountantStatus = async ({ id, isActive }) => {
  const response = await apiAxios.patch(`${BASE}/${id}/status`, { isActive });
  return response.data.data;
};
