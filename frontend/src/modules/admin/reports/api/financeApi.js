import apiAxios from "@shared/api/axios";   
import {FEE_TYPE_COLORS, EXPENSE_CATEGORY_COLORS } from "../utils/financeConstants";


const BASE = "/admin/reports/finance-report";
const delay = () => new Promise((r) => setTimeout(r, 200));

const FINANCE_MOCK_OVERVIEW = {
    totalRevenue:485200,
    totalRevenueTrend:"",
    collectedThisMonth: 392800,
    collectedTrend:"+$12.4k vs last month",
    outstandingFees: 92400,
    outstandingFeesTrend:"Needs follow-up",
    expenses: 162200,
    expensesTrend:"-$6.2k vs last month",
    collectionRate:81,
    collectionRateTrend:"+3.2%",

    
}

export const getFinanceOverview =async (filters = {}) => {
    // TODO: const response = await apiAxios.get(`${BASE}/overview`, { params: filters }); return response.data.data;
    await delay();
    return FINANCE_MOCK_OVERVIEW;
}

const MOCK_TREND = [
  { month: "Jan", expected: 50000, collected: 45000 },
  { month: "Feb", expected: 48000, collected: 44000 },
  { month: "Mar", expected: 46000, collected: 41000 },
  { month: "Apr", expected: 55000, collected: 50000 },
  { month: "May", expected: 60000, collected: 54000 },
  { month: "Jun", expected: 54000, collected: 47000 },
  { month: "Jul", expected: 44000, collected: 38000 },
  { month: "Aug", expected: 58000, collected: 52000 },
];

// expected/collected amounts chosen so the derived overall rate below lands
// at 81%, matching the screenshot's donut center label - see getRevenueByFeeType
const MOCK_FEE_TYPES = [
  { category: "Tuition", expected: 200000, collected: 164000 },
  { category: "Transport", expected: 30000, collected: 25500 },
  { category: "Meals & Canteen", expected: 15000, collected: 10800 },
  { category: "Activity", expected: 8000, collected: 4640 },
];

const MOCK_EXPENSES = [
  { category: "Staff Salaries", amount: 210000 },
  { category: "Infrastructure", amount: 48000 },
  { category: "Academic Materials", amount: 32000 },
  { category: "Utilities", amount: 18000 },
  { category: "Other", amount: 10600 },
];

// amount - paid = outstanding is computed at render time, never stored
// separately, so it can never drift from the source numbers.
const MOCK_FEE_RECORDS = [
  { id: "f1", studentName: "Olivia Brown", invoice: "INV-2026-003", feeType: "Tuition", amount: 4500, paid: 0, dueDate: "2026-08-01", status: "Overdue" },
  { id: "f2", studentName: "Alexander Lewis", invoice: "INV-2026-017", feeType: "Tuition", amount: 5100, paid: 0, dueDate: "2026-08-01", status: "Overdue" },
  { id: "f3", studentName: "Oliver Jackson", invoice: "INV-2026-010", feeType: "Tuition", amount: 4800, paid: 2400, dueDate: "2026-08-15", status: "Overdue" },
  { id: "f4", studentName: "Emma Johnson", invoice: "INV-2026-001", feeType: "Tuition", amount: 4500, paid: 4500, dueDate: "2026-09-01", status: "Paid" },
  { id: "f5", studentName: "Liam Williams", invoice: "INV-2026-002", feeType: "Tuition", amount: 4500, paid: 3000, dueDate: "2026-09-01", status: "Partial" },
  { id: "f6", studentName: "Noah Davis", invoice: "INV-2026-004", feeType: "Transport", amount: 800, paid: 800, dueDate: "2026-09-01", status: "Paid" },
  { id: "f7", studentName: "Sophia Miller", invoice: "INV-2026-005", feeType: "Tuition", amount: 4500, paid: 4500, dueDate: "2026-09-01", status: "Paid" },
  { id: "f8", studentName: "Isabella Moore", invoice: "INV-2026-007", feeType: "Tuition", amount: 4500, paid: 4500, dueDate: "2026-09-01", status: "Paid" },
  { id: "f9", studentName: "James Taylor", invoice: "INV-2026-008", feeType: "Meals & Canteen", amount: 480, paid: 480, dueDate: "2026-09-01", status: "Paid" },
  { id: "f10", studentName: "Benjamin Harris", invoice: "INV-2026-012", feeType: "Transport", amount: 800, paid: 800, dueDate: "2026-09-01", status: "Paid" },
  { id: "f11", studentName: "Harper Martinez", invoice: "INV-2026-015", feeType: "Tuition", amount: 5100, paid: 5100, dueDate: "2026-09-01", status: "Paid" },
  { id: "f12", studentName: "Mason Walker", invoice: "INV-2026-019", feeType: "Activity", amount: 250, paid: 250, dueDate: "2026-09-01", status: "Paid" },
  { id: "f13", studentName: "Ethan Wilson", invoice: "INV-2026-006", feeType: "Activity", amount: 250, paid: 0, dueDate: "2026-09-15", status: "Pending" },
  { id: "f14", studentName: "Sofia Hall", invoice: "INV-2026-020", feeType: "Meals & Canteen", amount: 480, paid: 240, dueDate: "2026-09-15", status: "Partial" },
];

export const getRevenueTrend = async (filters = {}) => {
  // TODO: const response = await apiAxios.get(`${BASE}/trend`, { params: filters }); return response.data.data;
  await delay();
  return MOCK_TREND;
};

export const getRevenueByFeeType = async (filters = {}) => {
  // TODO: const response = await apiAxios.get(`${BASE}/by-fee-type`, { params: filters }); return response.data.data;
  await delay();
  const categories = MOCK_FEE_TYPES.map((c) => ({
    ...c,
    color: FEE_TYPE_COLORS[c.category],
    pct: Math.round((c.collected / c.expected) * 100),
  }));
  const totalExpected = categories.reduce((sum, c) => sum + c.expected, 0);
  const totalCollected = categories.reduce((sum, c) => sum + c.collected, 0);
  return {
    categories,
    overallCollectedPct: Math.round((totalCollected / totalExpected) * 100), // derived, not authored
  };
};

export const getExpensesByCategory = async (filters = {}) => {
  // TODO: const response = await apiAxios.get(`${BASE}/expenses`, { params: filters }); return response.data.data;
  await delay();
  const total = MOCK_EXPENSES.reduce((sum, e) => sum + e.amount, 0);
  const categories = MOCK_EXPENSES.map((e) => ({
    ...e,
    color: EXPENSE_CATEGORY_COLORS[e.category],
    pct: Math.round((e.amount / total) * 100),
  }));
  return { total, categories };
};

export const getFeeCollectionRecords = async (filters = {}) => {
  // TODO: const response = await apiAxios.get(`${BASE}/fee-records`, { params: filters }); return response.data.data;
  await delay();
  return MOCK_FEE_RECORDS.map((r) => ({ ...r, outstanding: r.amount - r.paid }));
};