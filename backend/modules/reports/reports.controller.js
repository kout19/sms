const reportsService = require("./reports.service");

const readFilters = (req) => ({
  academicYear: req.query.academicYear,
  startDate: req.query.startDate,
  endDate: req.query.endDate,
  classId: req.query.classId,
  sectionId: req.query.sectionId,
  studentId: req.query.studentId,
  feeType: req.query.feeType,
  paymentStatus: req.query.paymentStatus,
  paymentMethod: req.query.paymentMethod,
  expenseCategory: req.query.expenseCategory,
  page: req.query.page,
  pageSize: req.query.pageSize,
});

exports.getOverview = async (req, res, next) => {
  try {
    const data = await reportsService.getFinanceOverview(req.tenant?.schoolId, readFilters(req));
    res.json({ data });
  } catch (error) {
    next(error);
  }
};

exports.getRevenueTrend = async (req, res, next) => {
  try {
    const data = await reportsService.getRevenueTrend(req.tenant?.schoolId, readFilters(req));
    res.json({ data: data.data, missingData: data.missingData });
  } catch (error) {
    next(error);
  }
};

exports.getRevenueByFeeType = async (req, res, next) => {
  try {
    const data = await reportsService.getRevenueByFeeType(req.tenant?.schoolId, readFilters(req));
    res.json({ data });
  } catch (error) {
    next(error);
  }
};

exports.getExpenseBreakdown = async (req, res, next) => {
  try {
    const data = await reportsService.getExpenseBreakdown(req.tenant?.schoolId, readFilters(req));
    res.json({ data });
  } catch (error) {
    next(error);
  }
};

exports.getReceivables = async (req, res, next) => {
  try {
    const data = await reportsService.getReceivables(req.tenant?.schoolId, readFilters(req));
    res.json({ data: data.data, meta: data.meta, missingData: data.missingData });
  } catch (error) {
    next(error);
  }
};

exports.getStudentFeeCollection = async (req, res, next) => {
  try {
    const data = await reportsService.getStudentFeeCollection(req.tenant?.schoolId, readFilters(req));
    res.json({ data: data.data, meta: data.meta, missingData: data.missingData });
  } catch (error) {
    next(error);
  }
};

exports.getPaymentMethods = async (req, res, next) => {
  try {
    const data = await reportsService.getPaymentMethods(req.tenant?.schoolId, readFilters(req));
    res.json({ data: data.data, missingData: data.missingData });
  } catch (error) {
    next(error);
  }
};

exports.getTransactions = async (req, res, next) => {
  try {
    const data = await reportsService.getTransactions(req.tenant?.schoolId, readFilters(req));
    res.json({ data: data.data, meta: data.meta, missingData: data.missingData });
  } catch (error) {
    next(error);
  }
};
