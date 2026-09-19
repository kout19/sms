import apiAxios from "@shared/api/axios";

const BASE = "/admin/messages";
const delay = (ms = 200) => new Promise((r) => setTimeout(r, ms));

const now = new Date();
const hoursAgo = (h) => new Date(now.getTime() - h * 3600 * 1000).toISOString();
const daysAgo = (d) =>
  new Date(now.getTime() - d * 24 * 3600 * 1000).toISOString();

// MOCK DATA - backend/modules/messages/ doesn't exist yet.
let MOCK_CONVERSATIONS = [
  {
    id: "c1",
    participantName: "Hana Tesfaye",
    role: "teacher",
    isOnline: true,
    lastMessageAt: hoursAgo(0.3),
    preview: "Can you check the attendance report...",
    unreadCount: 2,
    isStarred: true,
    isArchived: false,
  },
  {
    id: "c2",
    participantName: "Daniel Bekele",
    role: "parent",
    isOnline: false,
    lastMessageAt: hoursAgo(2),
    preview: "Thank you for the update. We will m...",
    unreadCount: 0,
    isStarred: false,
    isArchived: false,
  },
  {
    id: "c3",
    participantName: "Meron Alemu",
    role: "department_head",
    isOnline: true,
    lastMessageAt: daysAgo(1),
    preview: "The curriculum review meeting is co...",
    unreadCount: 1,
    isStarred: true,
    isArchived: false,
  },
  {
    id: "c4",
    participantName: "Samuel Girma",
    role: "accountant",
    isOnline: false,
    lastMessageAt: daysAgo(1),
    preview: "The updated fee schedule has been...",
    unreadCount: 0,
    isStarred: false,
    isArchived: false,
  },
  {
    id: "c5",
    participantName: "Rahel Worku",
    role: "teacher",
    isOnline: false,
    lastMessageAt: daysAgo(3),
    preview: "I've submitted the mid-term grades f...",
    unreadCount: 0,
    isStarred: false,
    isArchived: false,
  },
];

let MOCK_MESSAGES = {
  c1: [
    {
      id: "m1",
      senderId: "them",
      type: "text",
      text: "Good morning. I noticed that two of my students — Biruk Kebede and Selamawit Haile — are marked absent in the system for yesterday, May 17th. I can confirm they were both present in my 9 AM class.",
      sentAt: hoursAgo(1.5),
    },
    {
      id: "m2",
      senderId: "me",
      type: "text",
      text: "Good morning, Ms. Tesfaye. Thank you for flagging this. I'll look into the attendance records right away and correct any errors.",
      sentAt: hoursAgo(1.4),
      status: "read",
    },
    {
      id: "m3",
      senderId: "them",
      type: "file",
      fileName: "class_register_may17.pdf",
      fileSize: "284 KB",
      sentAt: hoursAgo(1.3),
    },
    {
      id: "m4",
      senderId: "them",
      type: "text",
      text: "I've attached a screenshot from my class register showing both students signed in. Please let me know once it's corrected so their parents aren't notified incorrectly.",
      sentAt: hoursAgo(1.3),
    },
    {
      id: "m5",
      senderId: "me",
      type: "text",
      text: "Got it — I can see the discrepancy. It looks like the system marked them absent due to a sync issue with the biometric scanner. I'll correct both records now and flag the issue to the IT team.",
      sentAt: hoursAgo(1.2),
      status: "delivered",
    },
  ],
  c2: [
    {
      id: "m6",
      senderId: "them",
      type: "text",
      text: "Thank you for the update. We will make sure Daniel is dropped off on time going forward.",
      sentAt: hoursAgo(2),
    },
  ],
  c3: [
    {
      id: "m7",
      senderId: "them",
      type: "text",
      text: "The curriculum review meeting is confirmed for Thursday at 2 PM in the staff room.",
      sentAt: daysAgo(1),
    },
  ],
  c4: [
    {
      id: "m8",
      senderId: "them",
      type: "text",
      text: "The updated fee schedule has been uploaded to the finance portal for your review.",
      sentAt: daysAgo(1),
    },
  ],
  c5: [
    {
      id: "m9",
      senderId: "them",
      type: "text",
      text: "I've submitted the mid-term grades for Grade 11A. Let me know if anything looks off.",
      sentAt: daysAgo(3),
    },
  ],
};

const MOCK_DIRECTORY = {
  teacher: [
    { id: "u1", name: "Hana Tesfaye" },
    { id: "u2", name: "Rahel Worku" },
    { id: "u3", name: "Girma Alemu" },
  ],
  parent: [
    { id: "u4", name: "Daniel Bekele" },
    { id: "u5", name: "Tigist Hailu" },
  ],
  student: [
    { id: "u6", name: "Biruk Kebede" },
    { id: "u7", name: "Selamawit Haile" },
  ],
  accountant: [{ id: "u8", name: "Samuel Girma" }],
  department_head: [{ id: "u9", name: "Meron Alemu" }],
};

export const getConversations = async (filters = {}) => {
  // TODO: const response = await apiAxios.get(BASE, { params: filters }); return response.data.data;
  await delay();
  let results = [...MOCK_CONVERSATIONS];

  if (filters.tab === "unread")
    results = results.filter((c) => c.unreadCount > 0 && !c.isArchived);
  else if (filters.tab === "starred")
    results = results.filter((c) => c.isStarred && !c.isArchived);
  else if (filters.tab === "archived")
    results = results.filter((c) => c.isArchived);
  else results = results.filter((c) => !c.isArchived); // "all" excludes archived, matching standard inbox convention

  if (filters.roles?.length)
    results = results.filter((c) => filters.roles.includes(c.role));
  if (filters.search) {
    const q = filters.search.toLowerCase();
    results = results.filter(
      (c) =>
        c.participantName.toLowerCase().includes(q) ||
        c.preview.toLowerCase().includes(q),
    );
  }

  return results.sort(
    (a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt),
  );
};

export const getConversationThread = async (conversationId) => {
  // TODO: const response = await apiAxios.get(`${BASE}/${conversationId}`); return response.data.data;
  await delay(150);
  const conversation = MOCK_CONVERSATIONS.find((c) => c.id === conversationId);
  return { conversation, messages: MOCK_MESSAGES[conversationId] || [] };
};

export const sendReply = async (conversationId, { text, attachment }) => {
  // TODO: const response = await apiAxios.post(`${BASE}/${conversationId}/messages`, { text, attachment }); return response.data.data;
  await delay(200);
  const message = {
    id: crypto.randomUUID(),
    senderId: "me",
    type: attachment ? "file" : "text",
    text,
    fileName: attachment?.name,
    fileSize: attachment?.size,
    sentAt: new Date().toISOString(),
    status: "sent",
  };
  MOCK_MESSAGES[conversationId] = [
    ...(MOCK_MESSAGES[conversationId] || []),
    message,
  ];
  const convo = MOCK_CONVERSATIONS.find((c) => c.id === conversationId);
  if (convo) {
    convo.preview = text || attachment?.name;
    convo.lastMessageAt = message.sentAt;
  }
  return message;
};

export const createConversation = async ({
  recipientIds,
  role,
  subject,
  text,
  attachment,
}) => {
  // TODO: const response = await apiAxios.post(BASE, payload); return response.data.data;
  await delay(250);
  const created = recipientIds.map((id) => {
    const person = MOCK_DIRECTORY[role]?.find((p) => p.id === id);
    const conversation = {
      id: crypto.randomUUID(),
      participantName: person?.name || "Unknown",
      role,
      isOnline: false,
      lastMessageAt: new Date().toISOString(),
      preview: subject ? `${subject}: ${text}` : text,
      unreadCount: 0,
      isStarred: false,
      isArchived: false,
    };
    MOCK_CONVERSATIONS = [conversation, ...MOCK_CONVERSATIONS];
    MOCK_MESSAGES[conversation.id] = [
      {
        id: crypto.randomUUID(),
        senderId: "me",
        type: "text",
        text: subject ? `${subject}\n\n${text}` : text,
        sentAt: conversation.lastMessageAt,
        status: "sent",
      },
    ];
    return conversation;
  });
  return created;
};

export const toggleStar = async (conversationId) => {
  const convo = MOCK_CONVERSATIONS.find((c) => c.id === conversationId);
  if (convo) convo.isStarred = !convo.isStarred;
  return convo;
};

export const toggleArchive = async (conversationId) => {
  const convo = MOCK_CONVERSATIONS.find((c) => c.id === conversationId);
  if (convo) convo.isArchived = !convo.isArchived;
  return convo;
};

export const markAsRead = async (conversationId) => {
  const convo = MOCK_CONVERSATIONS.find((c) => c.id === conversationId);
  if (convo) convo.unreadCount = 0;
  return convo;
};

export const searchDirectory = async (role, query = "") => {
  // TODO: const response = await apiAxios.get(`${BASE}/directory`, { params: { role, query } }); return response.data.data;
  await delay(150);
  const pool = MOCK_DIRECTORY[role] || [];
  if (!query) return pool;
  return pool.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));
};
