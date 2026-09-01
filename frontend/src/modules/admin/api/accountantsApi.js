import apiAxios from "../../../shared/api/axios";

const BASE = "/admin/accountants";

const MOCK_ACCOUNTANTS = [
  {
    id: "a1",
    name: "Patricia Moore",
    email: "p.moore@school.edu",
    responsibilities: ["Fee Collection", "Payroll", "Audits"],
    transactionCount: 2841,
    isActive: true,
    lastActiveAt: new Date().toISOString(),
  },
  {
    id: "a2",
    name: "Victor Osei",
    email: "v.osei@school.edu",
    responsibilities: ["Vendor Payments", "Procurement", "Budgeting"],
    transactionCount: 1573,
    isActive: true,
    lastActiveAt: new Date(Date.now() - 3600 * 1000).toISOString(),
  },
  {
    id: "a3",
    name: "Diana Chambers",
    email: "d.chambers@school.edu",
    responsibilities: ["Scholarships", "Grants", "Reporting"],
    transactionCount: 984,
    isActive: true,
    lastActiveAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
  },
  {
    id: "a4",
    name: "Marcus Levin",
    email: "m.levin@school.edu",
    responsibilities: ["Tax Compliance", "Expense Tracking"],
    transactionCount: 642,
    isActive: false,
    lastActiveAt: "2024-01-18T00:00:00.000Z",
  },
  {
    id: "a5",
    name: "Amaka Eze",
    email: "a.eze@school.edu",
    responsibilities: ["Student Refunds", "Bursary Management"],
    transactionCount: 1201,
    isActive: true,
    lastActiveAt: new Date().toISOString(),
  },
];

const MOCK_TRANSACTIONS = [
  {
    id: "t1",
    type: "Fee Payment",
    person: "James Chen",
    amount: 1200,
    direction: "credit",
    status: "completed",
    txnId: "TXN-8841",
    occurredAt: new Date().toISOString(),
  },
  {
    id: "t2",
    type: "Scholarship Credit",
    person: "Amara Okafor",
    amount: -800,
    direction: "debit",
    status: "completed",
    txnId: "TXN-8840",
    occurredAt: new Date(Date.now() - 3600 * 1000).toISOString(),
  },
  {
    id: "t3",
    type: "Late Fee",
    person: "Felix Bergmann",
    amount: 50,
    direction: "credit",
    status: "completed",
    txnId: "TXN-8839",
    occurredAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
  },
  {
    id: "t4",
    type: "Refund Issued",
    person: "Lena Hoffman",
    amount: -200,
    direction: "debit",
    status: "pending",
    txnId: "TXN-8838",
    occurredAt: new Date(Date.now() - 25 * 3600 * 1000).toISOString(),
  },
  {
    id: "t5",
    type: "Annual Tuition",
    person: "Miguel Torres",
    amount: 4800,
    direction: "credit",
    status: "completed",
    txnId: "TXN-8837",
    occurredAt: "2024-01-20T00:00:00.000Z",
  },
  {
    id: "t6",
    type: "Bursary Disbursement",
    person: "Kwame Mbeki",
    amount: -1500,
    direction: "debit",
    status: "completed",
    txnId: "TXN-8836",
    occurredAt: "2024-01-19T00:00:00.000Z",
  },
];

export const getFinanceOverview = async () => {
  // TODO: const response = await apiAxios.get(`${BASE}/overview`); return response.data.data;
  await new Promise((r) => setTimeout(r, 200));
  return {
    totalAccountants: MOCK_ACCOUNTANTS.length,
    activeToday: MOCK_ACCOUNTANTS.filter((a) => a.isActive).length,
    pendingTasks: 7,
    transactionCount: MOCK_TRANSACTIONS.length * 1040, // placeholder scale to match screenshot's larger number
    transactionTrend: "+18%",
    totalRevenue: 284500,
    collectedThisMonth: 32840,
    outstandingFees: 18240,
    outstandingStudentCount: 47,
    disbursements: 12600,
  };
};

export const getAllAccountants = async (filters = {}) => {
  // TODO: const response = await apiAxios.get(BASE, { params: filters }); return response.data.data;
  await new Promise((r) => setTimeout(r, 200));
  let results = MOCK_ACCOUNTANTS;
  if (filters.status && filters.status !== "all") {
    results = results.filter((a) =>
      filters.status === "active" ? a.isActive : !a.isActive,
    );
  }
  if (filters.search) {
    const q = filters.search.toLowerCase();
    results = results.filter((a) => a.name.toLowerCase().includes(q));
  }
  return results;
};

export const toggleAccountantStatus = async (id) => {
  const accountant = MOCK_ACCOUNTANTS.find((a) => a.id === id);
  if (!accountant) throw new Error("Accountant not found");
  accountant.isActive = !accountant.isActive;
  return accountant;
};

export const getRecentTransactions = async (limit = 6) => {
  // TODO: const response = await apiAxios.get(`${BASE}/transactions`, { params: { limit } }); return response.data.data;
  await new Promise((r) => setTimeout(r, 200));
  return MOCK_TRANSACTIONS.slice(0, limit);
};
