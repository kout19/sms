import apiAxios from "@shared/api/axios";

const BASE = "/announcements/inbox";

export async function getInbox(filters = {}, { signal } = {}) {
  const response = await apiAxios.get(BASE, { params: filters, signal });
  return response.data;
}

export async function getInboxAnnouncement(id, { signal } = {}) {
  const response = await apiAxios.get(`${BASE}/${id}`, { signal });
  return response.data.data;
}

export async function setReadState(id, read) {
  const response = await apiAxios.patch(`${BASE}/${id}/${read ? "read" : "unread"}`);
  return response.data.data;
}

export async function getUnreadCount({ signal } = {}) {
  const response = await apiAxios.get(`${BASE}/unread-count`, { signal });
  return response.data.data;
}
