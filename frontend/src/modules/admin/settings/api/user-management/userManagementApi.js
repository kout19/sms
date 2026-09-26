import apiAxios from "@shared/api/axios";

const BASE = "/admin/settings/users";
const delay = (ms = 200) => new Promise((r) => setTimeout(r, ms));

// department here is MOCK-ONLY convenience - see the schema note above.
// permissionsSummary numbers are illustrative placeholders, not derived
// from real rolePermissions - current permission strings (view:/manage:/
// mark:/post:/issue:) don't cleanly map to a View/Create/Edit/Delete split,
// so faking that derivation would misrepresent granularity that doesn't
// exist yet. A real implementation needs that categorization decided first.
let MOCK_USERS = [
  {
    id: "u1",
    firstName: "Abebe",
    lastName: "Kebede",
    username: "abebe.kebede",
    email: "abebe@school.edu.et",
    phone: "+251 91 234 5678",
    role: "teacher",
    department: "Science",
    status: "active",
    lastLoginAt: new Date().toISOString(),
    createdAt: "2026-09-02",
    permissionsSummary: { view: 18, create: 12, edit: 13, delete: 6 },
    recentActivity: [
      { action: "Logged in", at: new Date().toISOString() },
      { action: "Updated profile", at: "2026-09-19T14:20:00" },
    ],
  },
  {
    id: "u2",
    firstName: "Tigist",
    lastName: "Haile",
    username: "tigist.haile",
    email: "tigist@school.edu.et",
    phone: "+251 91 345 6789",
    role: "admin",
    department: "Administration",
    status: "active",
    lastLoginAt: new Date().toISOString(),
    createdAt: "2026-08-15",
    permissionsSummary: { view: 40, create: 40, edit: 40, delete: 40 },
    recentActivity: [],
  },
  {
    id: "u3",
    firstName: "Dawit",
    lastName: "Tadesse",
    username: "dawit.tadesse",
    email: "dawit@school.edu.et",
    phone: "+251 91 456 7890",
    role: "department_head",
    department: "Mathematics",
    status: "active",
    lastLoginAt: "2026-09-19T14:20:00",
    createdAt: "2026-08-20",
    permissionsSummary: { view: 20, create: 10, edit: 15, delete: 4 },
    recentActivity: [],
  },
  {
    id: "u4",
    firstName: "Sara",
    lastName: "Bekele",
    username: "sara.bekele",
    email: "sara@school.edu.et",
    phone: "+251 91 567 8901",
    role: "accountant",
    department: "Finance",
    status: "inactive",
    lastLoginAt: "2026-09-10",
    createdAt: "2026-07-12",
    permissionsSummary: { view: 15, create: 8, edit: 9, delete: 2 },
    recentActivity: [],
  },
  {
    id: "u5",
    firstName: "Hana",
    lastName: "Girma",
    username: "hana.girma",
    email: "hana@school.edu.et",
    phone: "+251 91 678 9012",
    role: "teacher",
    department: "English",
    status: "pending",
    lastLoginAt: null,
    createdAt: "2026-09-18",
    permissionsSummary: { view: 18, create: 12, edit: 13, delete: 6 },
    recentActivity: [],
  },
  {
    id: "u6",
    firstName: "Mulugeta",
    lastName: "Wolde",
    username: "mulugeta.wolde",
    email: "mulugeta@school.edu.et",
    phone: "+251 91 789 0123",
    role: "teacher",
    department: "History",
    status: "suspended",
    lastLoginAt: "2026-09-01",
    createdAt: "2026-06-10",
    permissionsSummary: { view: 18, create: 12, edit: 13, delete: 6 },
    recentActivity: [],
  },
  {
    id: "u7",
    firstName: "Yohannes",
    lastName: "Alemu",
    username: "yohannes.alemu",
    email: "yohannes@school.edu.et",
    phone: "+251 91 890 1234",
    role: "admin",
    department: "IT",
    status: "active",
    lastLoginAt: "2026-09-17",
    createdAt: "2026-05-05",
    permissionsSummary: { view: 40, create: 40, edit: 40, delete: 40 },
    recentActivity: [],
  },
];

export const getUsers = async (filters = {}) => {
  // TODO: const response = await apiAxios.get(BASE, { params: filters }); return response.data.data;
  await delay();
  let results = [...MOCK_USERS];
  if (filters.search) {
    const q = filters.search.toLowerCase();
    results = results.filter(
      (u) =>
        `${u.firstName} ${u.lastName}`.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q),
    );
  }
  if (filters.role && filters.role !== "all")
    results = results.filter((u) => u.role === filters.role);
  if (filters.status && filters.status !== "all")
    results = results.filter((u) => u.status === filters.status);

  const total = results.length;
  const page = filters.page || 1;
  const pageSize = filters.pageSize || 10;
  const start = (page - 1) * pageSize;
  return { items: results.slice(start, start + pageSize), total };
};

export const getUserById = async (id) => {
  await delay(150);
  return MOCK_USERS.find((u) => u.id === id) || null;
};

export const updateUser = async (id, payload) => {
  const user = MOCK_USERS.find((u) => u.id === id);
  if (!user) throw new Error("User not found");
  Object.assign(user, payload);
  return user;
};

export const changeUserRole = async (id, role) => {
  const user = MOCK_USERS.find((u) => u.id === id);
  if (user) user.role = role;
  return user;
};

export const toggleSuspendUser = async (id) => {
  const user = MOCK_USERS.find((u) => u.id === id);
  if (user) user.status = user.status === "suspended" ? "active" : "suspended";
  return user;
};

export const resetUserPassword = async (id) => {
  // TODO: real backend sends a reset email / generates a temp password
  await delay(300);
  return { id, resetSentAt: new Date().toISOString() };
};

export const deleteUser = async (id) => {
  MOCK_USERS = MOCK_USERS.filter((u) => u.id !== id);
  return id;
};
