import apiAxios from "@shared/api/axios";

const BASE = "/announcements/admin";

export async function getAnnouncements(filters = {}, { signal } = {}) {
  const response = await apiAxios.get(BASE, { params: filters, signal });
  return response.data;
}

export async function getAnnouncementById(id, { signal } = {}) {
  const response = await apiAxios.get(`${BASE}/${id}`, { signal });
  return response.data.data;
}

export async function getAudienceOptions({ signal } = {}) {
  const response = await apiAxios.get(`${BASE}/audience-options`, { signal });
  return response.data.data;
}

export async function createAnnouncement(payload) {
  const response = await apiAxios.post(BASE, payload);
  return response.data.data;
}

export async function updateAnnouncement(id, payload) {
  const response = await apiAxios.patch(`${BASE}/${id}`, payload);
  return response.data.data;
}

export async function publishAnnouncement(id) {
  const response = await apiAxios.post(`${BASE}/${id}/publish`);
  return response.data.data;
}

export async function scheduleAnnouncement(id, scheduledFor) {
  const response = await apiAxios.post(`${BASE}/${id}/schedule`, { scheduledFor });
  return response.data.data;
}

export async function cancelAnnouncement(id) {
  const response = await apiAxios.post(`${BASE}/${id}/cancel`);
  return response.data.data;
}

export async function revertAnnouncementToDraft(id) {
  const response = await apiAxios.post(`${BASE}/${id}/draft`);
  return response.data.data;
}

export async function archiveAnnouncement(id) {
  const response = await apiAxios.post(`${BASE}/${id}/archive`);
  return response.data.data;
}

export async function expireAnnouncement(id) {
  const response = await apiAxios.post(`${BASE}/${id}/expire`);
  return response.data.data;
}

export async function getAnnouncementStatistics(id, { signal } = {}) {
  const response = await apiAxios.get(`${BASE}/${id}/statistics`, { signal });
  return response.data.data;
}

export async function getAnnouncementRecipients(id, filters = {}, { signal } = {}) {
  const response = await apiAxios.get(`${BASE}/${id}/recipients`, { params: filters, signal });
  return response.data;
}
