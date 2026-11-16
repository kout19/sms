const express = require("express");
const authenticate = require("../../middlewares/authenticate");
const authorize = require("../../middlewares/authorize");
const tenantScope = require("../../middlewares/tenantScope");
const { PERMISSIONS } = require("@packages/shared");
const controller = require("./reports.controller");
const academicRoutes = require("./academic/academicReport.routes");

const router = express.Router();

router.use(authenticate, tenantScope);

const canViewReports = authorize(
  PERMISSIONS.VIEW_REPORTS,
  PERMISSIONS.VIEW_REVENUE_REPORTS,
  PERMISSIONS.MANAGE_REPORTS,
  PERMISSIONS.MANAGE_REVENUE_REPORTS,
);

router.get("/reports/finance/overview", canViewReports, controller.getOverview);
router.get("/reports/finance/summary", canViewReports, controller.getOverview);
router.get("/reports/finance/trends", canViewReports, controller.getRevenueTrend);
router.get("/reports/finance/revenue-by-fee-type", canViewReports, controller.getRevenueByFeeType);
router.get("/reports/finance/expenses", canViewReports, controller.getExpenseBreakdown);
router.get("/reports/finance/receivables", canViewReports, controller.getReceivables);
router.get("/reports/finance/student-fees", canViewReports, controller.getStudentFeeCollection);
router.get("/reports/finance/payment-methods", canViewReports, controller.getPaymentMethods);
router.get("/reports/finance/transactions", canViewReports, controller.getTransactions);

router.get("/reports/finance-report/overview", canViewReports, controller.getOverview);
router.get("/reports/finance-report/summary", canViewReports, controller.getOverview);
router.get("/reports/finance-report/trends", canViewReports, controller.getRevenueTrend);
router.get("/reports/finance-report/revenue-by-fee-type", canViewReports, controller.getRevenueByFeeType);
router.get("/reports/finance-report/expenses", canViewReports, controller.getExpenseBreakdown);
router.get("/reports/finance-report/receivables", canViewReports, controller.getReceivables);
router.get("/reports/finance-report/student-fees", canViewReports, controller.getStudentFeeCollection);
router.get("/reports/finance-report/payment-methods", canViewReports, controller.getPaymentMethods);
router.get("/reports/finance-report/transactions", canViewReports, controller.getTransactions);

router.get("/finance/overview", canViewReports, controller.getOverview);
router.get("/finance/summary", canViewReports, controller.getOverview);
router.get("/finance/trends", canViewReports, controller.getRevenueTrend);
router.get("/finance/revenue-by-fee-type", canViewReports, controller.getRevenueByFeeType);
router.get("/finance/expenses", canViewReports, controller.getExpenseBreakdown);
router.get("/finance/receivables", canViewReports, controller.getReceivables);
router.get("/finance/student-fees", canViewReports, controller.getStudentFeeCollection);
router.get("/finance/payment-methods", canViewReports, controller.getPaymentMethods);
router.get("/finance/transactions", canViewReports, controller.getTransactions);

router.get("/finance-report/overview", canViewReports, controller.getOverview);
router.get("/finance-report/summary", canViewReports, controller.getOverview);
router.get("/finance-report/trends", canViewReports, controller.getRevenueTrend);
router.get("/finance-report/revenue-by-fee-type", canViewReports, controller.getRevenueByFeeType);
router.get("/finance-report/expenses", canViewReports, controller.getExpenseBreakdown);
router.get("/finance-report/receivables", canViewReports, controller.getReceivables);
router.get("/finance-report/student-fees", canViewReports, controller.getStudentFeeCollection);
router.get("/finance-report/payment-methods", canViewReports, controller.getPaymentMethods);
router.get("/finance-report/transactions", canViewReports, controller.getTransactions);

router.use("/reports/academic", academicRoutes);
router.use("/reports/academic-report", academicRoutes);

module.exports = router;
