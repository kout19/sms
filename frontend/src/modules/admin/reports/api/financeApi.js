import apiAxios from "@shared/api/axios";

const BASE = "/admin/reports/finance-report";

const emptyOverview = {
  totalRevenue: 0,
  totalRevenueTrend: "No data",
  collectedThisMonth: 0,
  collectedTrend: "No payment ledger",
  outstandingFees: 0,
  outstandingFeesTrend: "No receivable ledger",
  expenses: 0,
  expensesTrend: "No expense ledger",
  collectionRate: 0,
  collectionRateTrend: "No data",
  missingData: "The current schema does not include fee, invoice, payment, refund, or expense tables.",
};

const emptyTrend = [];
const emptyRevenueByFeeType = { categories: [], overallCollectedPct: 0, missingData: emptyOverview.missingData };
const emptyExpensesByCategory = { total: 0, categories: [], missingData: emptyOverview.missingData };
const emptyRecords = [];

const safeFetch = async (path, fallback, filters = {}) => {
  try {
    const response = await apiAxios.get(`${BASE}/${path}`, { params: filters });
    return response?.data?.data ?? response?.data ?? fallback;
  } catch (error) {
    return fallback;
  }
};

export const getFinanceOverview = async (filters = {}) => {
  const data = await safeFetch("overview", emptyOverview, filters);
  return { ...emptyOverview, ...data };
};

export const getRevenueTrend = async (filters = {}) => {
  const data = await safeFetch("trends", emptyTrend, filters);
  return Array.isArray(data) ? data : emptyTrend;
};

export const getRevenueByFeeType = async (filters = {}) => {
  const data = await safeFetch("revenue-by-fee-type", emptyRevenueByFeeType, filters);
  return { ...emptyRevenueByFeeType, ...data };
};

export const getExpensesByCategory = async (filters = {}) => {
  const data = await safeFetch("expenses", emptyExpensesByCategory, filters);
  return { ...emptyExpensesByCategory, ...data };
};

export const getFeeCollectionRecords = async (filters = {}) => {
  const data = await safeFetch("receivables", emptyRecords, filters);
  if (!Array.isArray(data)) {
    return emptyRecords;
  }
  return data;
};