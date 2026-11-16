const buildMissingFinanceData = (filters = {}) => {
  const baseFilters = {
    academicYear: filters.academicYear || "all",
    startDate: filters.startDate || null,
    endDate: filters.endDate || null,
    classId: filters.classId || "all",
    sectionId: filters.sectionId || "all",
    studentId: filters.studentId || "all",
    feeType: filters.feeType || "all",
    paymentStatus: filters.paymentStatus || "all",
    paymentMethod: filters.paymentMethod || "all",
    expenseCategory: filters.expenseCategory || "all",
  };

  return {
    status: "unavailable",
    supported: false,
    reason:
      "The current schema does not include fee, invoice, payment, refund, or expense tables. Financial reporting is intentionally disabled until those records exist.",
    requiredModels: [
      "Invoice",
      "InvoiceItem",
      "Payment",
      "PaymentAllocation",
      "Expense",
      "ExpenseCategory",
      "Refund",
      "Waiver",
    ],
    filters: baseFilters,
    summary: {
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
      missingData: true,
    },
    revenueTrend: [],
    revenueByFeeType: {
      categories: [],
      overallCollectedPct: 0,
      missingData: true,
    },
    expenseData: {
      total: 0,
      categories: [],
      missingData: true,
    },
    receivables: [],
    paymentMethods: [],
    transactions: [],
  };
};

exports.getFinanceOverview = async (schoolId, filters = {}) => {
  const data = buildMissingFinanceData(filters);
  return {
    ...data.summary,
    missingData: data.reason,
    requiredModels: data.requiredModels,
    schoolId,
  };
};

exports.getRevenueTrend = async (schoolId, filters = {}) => {
  const data = buildMissingFinanceData(filters);
  return {
    data: data.revenueTrend,
    missingData: data.reason,
    schoolId,
  };
};

exports.getRevenueByFeeType = async (schoolId, filters = {}) => {
  const data = buildMissingFinanceData(filters);
  return {
    ...data.revenueByFeeType,
    missingData: data.reason,
    schoolId,
  };
};

exports.getExpenseBreakdown = async (schoolId, filters = {}) => {
  const data = buildMissingFinanceData(filters);
  return {
    ...data.expenseData,
    missingData: data.reason,
    schoolId,
  };
};

exports.getReceivables = async (schoolId, filters = {}) => {
  const data = buildMissingFinanceData(filters);
  return {
    data: data.receivables,
    meta: {
      total: 0,
      page: Number(filters.page || 1),
      pageSize: Number(filters.pageSize || 25),
      schoolId,
    },
    missingData: data.reason,
  };
};

exports.getStudentFeeCollection = async (schoolId, filters = {}) => {
  const data = buildMissingFinanceData(filters);
  return {
    data: [],
    meta: {
      total: 0,
      page: Number(filters.page || 1),
      pageSize: Number(filters.pageSize || 25),
      schoolId,
    },
    missingData: data.reason,
  };
};

exports.getPaymentMethods = async (schoolId, filters = {}) => {
  const data = buildMissingFinanceData(filters);
  return {
    data: data.paymentMethods,
    missingData: data.reason,
    schoolId,
  };
};

exports.getTransactions = async (schoolId, filters = {}) => {
  const data = buildMissingFinanceData(filters);
  return {
    data: data.transactions,
    meta: {
      total: 0,
      page: Number(filters.page || 1),
      pageSize: Number(filters.pageSize || 25),
      schoolId,
    },
    missingData: data.reason,
  };
};
