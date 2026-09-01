import apiAxios from "../../../shared/api/axios";

const BASE = "/admin/parents";

// MOCK DATA - backend/modules/parents/ doesn't exist yet.
const MOCK_PARENTS = [
  {
    id: "p1",
    code: "P-001",
    name: "Margaret Chen",
    email: "m.chen@gmail.com",
    phone: "+1 (555) 234-5678",
    children: [
      { name: "James Chen", grade: "Gr. 8B" },
      { name: "Sofia Chen", grade: "Gr. 5A" },
    ],
    isActive: true,
    registeredDate: "2023-09-01",
  },
  {
    id: "p2",
    code: "P-002",
    name: "David Okafor",
    email: "d.okafor@outlook.com",
    phone: "+1 (555) 876-5432",
    children: [{ name: "Amara Okafor", grade: "Gr. 10A" }],
    isActive: true,
    registeredDate: "2023-08-28",
  },
  {
    id: "p3",
    code: "P-003",
    name: "Sarah Hoffman",
    email: "s.hoffman@yahoo.com",
    phone: "+1 (555) 345-9012",
    children: [
      { name: "Lena Hoffman", grade: "Gr. 3C" },
      { name: "Tom Hoffman", grade: "Gr. 7A" },
      { name: "Zoe Hoffman", grade: "Gr. 11B" },
    ],
    isActive: true,
    registeredDate: "2023-09-05",
  },
  {
    id: "p4",
    code: "P-004",
    name: "James Mbeki",
    email: "j.mbeki@email.com",
    phone: "+1 (555) 456-7890",
    children: [{ name: "Kwame Mbeki", grade: "Gr. 9B" }],
    isActive: false,
    registeredDate: "2023-10-10",
  },
  {
    id: "p5",
    code: "P-005",
    name: "Rachel Torres",
    email: "r.torres@gmail.com",
    phone: "+1 (555) 567-8901",
    children: [
      { name: "Miguel Torres", grade: "Gr. 6A" },
      { name: "Isla Torres", grade: "Gr. 4C" },
    ],
    isActive: true,
    registeredDate: "2023-09-12",
  },
  {
    id: "p6",
    code: "P-006",
    name: "Emmanuel Nwachukwu",
    email: "e.nwachukwu@email.com",
    phone: "+1 (555) 678-9012",
    children: [{ name: "Ada Nwachukwu", grade: "Gr. 2B" }],
    isActive: true,
    registeredDate: "2023-11-03",
  },
  {
    id: "p7",
    code: "P-007",
    name: "Priya Sharma",
    email: "p.sharma@outlook.com",
    phone: "+1 (555) 789-0123",
    children: [
      { name: "Arjun Sharma", grade: "Gr. 7C" },
      { name: "Mia Sharma", grade: "Gr. 5B" },
    ],
    isActive: true,
    registeredDate: "2023-08-20",
  },
  {
    id: "p8",
    code: "P-008",
    name: "Thomas Bergmann",
    email: "t.bergmann@gmail.com",
    phone: "+1 (555) 890-1234",
    children: [{ name: "Felix Bergmann", grade: "Gr. 11A" }],
    isActive: false,
    registeredDate: "2024-01-15",
  },
  {
    id: "p9",
    code: "P-009",
    name: "Linda Park",
    email: "l.park@gmail.com",
    phone: "+1 (555) 901-2345",
    children: [{ name: "Ethan Park", grade: "Gr. 6B" }],
    isActive: true,
    registeredDate: "2023-12-02",
  },
];

export const getAllParents = async (filters = {}) => {
  // TODO once backend exists:
  // const response = await apiAxios.get(BASE, { params: filters });
  // return response.data; // expect { items, total }
  await new Promise((r) => setTimeout(r, 200));

  let results = MOCK_PARENTS;
  if (filters.status && filters.status !== "all") {
    results = results.filter((p) =>
      filters.status === "active" ? p.isActive : !p.isActive,
    );
  }
  if (filters.search) {
    const q = filters.search.toLowerCase();
    results = results.filter(
      (p) =>
        p.name.toLowerCase().includes(q) || p.email.toLowerCase().includes(q),
    );
  }

  const total = results.length;
  const page = filters.page || 1;
  const pageSize = filters.pageSize || 8;
  const start = (page - 1) * pageSize;

  return { items: results.slice(start, start + pageSize), total };
};

export const getParentById = async (id) => {
  await new Promise((r) => setTimeout(r, 150));
  return MOCK_PARENTS.find((p) => p.id === id) || null;
};

export const createParent = async (payload) => {
  const newParent = {
    id: crypto.randomUUID(),
    code: `P-${String(MOCK_PARENTS.length + 1).padStart(3, "0")}`,
    children: [],
    isActive: true,
    registeredDate: new Date().toISOString().slice(0, 10),
    ...payload,
  };
  MOCK_PARENTS.push(newParent);
  return newParent;
};

export const updateParent = async (id, payload) => {
  const parent = MOCK_PARENTS.find((p) => p.id === id);
  if (!parent) throw new Error("Parent not found");
  Object.assign(parent, payload);
  return parent;
};

export const deleteParent = async (id) => {
  const index = MOCK_PARENTS.findIndex((p) => p.id === id);
  if (index !== -1) MOCK_PARENTS.splice(index, 1);
  return id;
};

export const toggleParentStatus = async (id) => {
  const parent = MOCK_PARENTS.find((p) => p.id === id);
  if (!parent) throw new Error("Parent not found");
  parent.isActive = !parent.isActive;
  return parent;
};
