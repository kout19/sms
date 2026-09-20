import apiAxios from "@shared/api/axios";

const BASE = "/admin/announcements";
const delay = (ms = 200) => new Promise((r) => setTimeout(r, ms));

let MOCK_ANNOUNCEMENTS = [
  {
    id: "a1",
    title: "School Reopening Notice",
    content:
      "Dear community members, we are pleased to announce that school will reopen on September 15, 2026 following the scheduled maintenance period. All students are expected to report by 7:30 AM in full uniform.",
    audience: "everyone",
    authorName: "Admin",
    priority: "important",
    status: "published",
    publishDate: "2026-09-15",
    createdAt: "2026-09-01",
    scheduledFor: null,
    attachments: [],
    stats: { recipients: 2340, delivered: 2301, read: 1842 },
  },
  {
    id: "a2",
    title: "Parent-Teacher Meeting Schedule",
    content:
      "The Parent-Teacher Meeting for Term 1 is scheduled for September 18th, 2026 from 2 PM to 5 PM in the main hall.",
    audience: "parents",
    authorName: "Admin",
    priority: "normal",
    status: "scheduled",
    publishDate: "2026-09-18",
    createdAt: "2026-09-05",
    scheduledFor: "2026-09-18T08:00",
    attachments: [],
    stats: { recipients: 0, delivered: 0, read: 0 },
  },
  {
    id: "a3",
    title: "Midterm Examination Schedule",
    content:
      "The midterm examination schedule for all grades has been finalized and will be shared shortly.",
    audience: "students",
    authorName: "Tigist Haile",
    priority: "important",
    status: "draft",
    publishDate: null,
    createdAt: "2026-09-14",
    scheduledFor: null,
    attachments: [],
    stats: { recipients: 0, delivered: 0, read: 0 },
  },
  {
    id: "a4",
    title: "New Library Resources Available",
    content:
      "We are excited to announce that 500 new titles have been added to the school library, covering science, literature, and technology.",
    audience: "everyone",
    authorName: "Admin",
    priority: "normal",
    status: "published",
    publishDate: "2026-09-10",
    createdAt: "2026-09-08",
    scheduledFor: null,
    attachments: [],
    stats: { recipients: 2340, delivered: 2280, read: 1120 },
  },
  {
    id: "a5",
    title: "Sports Day Preparations",
    content:
      "Annual Sports Day is scheduled for September 20th. All students should register for events with their PE teacher by Friday.",
    audience: "students",
    authorName: "Bekele Tadesse",
    priority: "normal",
    status: "scheduled",
    publishDate: "2026-09-20",
    createdAt: "2026-09-12",
    scheduledFor: "2026-09-20T07:00",
    attachments: [],
    stats: { recipients: 0, delivered: 0, read: 0 },
  },
  {
    id: "a6",
    title: "Emergency Safety Drill",
    content:
      "A mandatory emergency safety drill will take place this Friday at 10 AM. All staff must review the evacuation procedure beforehand.",
    audience: "teachers",
    authorName: "Admin",
    priority: "urgent",
    status: "published",
    publishDate: "2026-09-12",
    createdAt: "2026-09-11",
    scheduledFor: null,
    attachments: [],
    stats: { recipients: 85, delivered: 85, read: 79 },
  },
  {
    id: "a7",
    title: "Fee Payment Reminder",
    content:
      "This is a reminder that Term 1 fees are due by September 1st. Please contact the finance office for any payment plan inquiries.",
    audience: "parents",
    authorName: "Admin",
    priority: "important",
    status: "archived",
    publishDate: "2026-09-08",
    createdAt: "2026-08-25",
    scheduledFor: null,
    attachments: [],
    stats: { recipients: 620, delivered: 610, read: 540 },
  },
];

export const getAnnouncements = async (filters = {}) => {
  // TODO: const response = await apiAxios.get(BASE, { params: filters }); return response.data.data;
  await delay();
  let results = [...MOCK_ANNOUNCEMENTS];
  if (filters.search) {
    const q = filters.search.toLowerCase();
    results = results.filter((a) => a.title.toLowerCase().includes(q));
  }
  if (filters.audience && filters.audience !== "all")
    results = results.filter((a) => a.audience === filters.audience);
  if (filters.status && filters.status !== "all")
    results = results.filter((a) => a.status === filters.status);
  if (filters.priority && filters.priority !== "all")
    results = results.filter((a) => a.priority === filters.priority);

  results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const total = results.length;
  const page = filters.page || 1;
  const pageSize = filters.pageSize || 7;
  const start = (page - 1) * pageSize;
  return { items: results.slice(start, start + pageSize), total };
};

export const getAnnouncementById = async (id) => {
  await delay(150);
  return MOCK_ANNOUNCEMENTS.find((a) => a.id === id) || null;
};

export const createAnnouncement = async (payload) => {
  const newItem = {
    id: crypto.randomUUID(),
    authorName: "Admin",
    createdAt: new Date().toISOString().slice(0, 10),
    stats: { recipients: 0, delivered: 0, read: 0 },
    attachments: [],
    ...payload,
  };
  MOCK_ANNOUNCEMENTS = [newItem, ...MOCK_ANNOUNCEMENTS];
  return newItem;
};

export const updateAnnouncement = async (id, payload) => {
  const item = MOCK_ANNOUNCEMENTS.find((a) => a.id === id);
  if (!item) throw new Error("Announcement not found");
  Object.assign(item, payload);
  return item;
};

export const archiveAnnouncement = async (id) => {
  const item = MOCK_ANNOUNCEMENTS.find((a) => a.id === id);
  if (item) item.status = item.status === "archived" ? "published" : "archived";
  return item;
};

export const deleteAnnouncement = async (id) => {
  MOCK_ANNOUNCEMENTS = MOCK_ANNOUNCEMENTS.filter((a) => a.id !== id);
  return id;
};
