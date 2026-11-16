const express = require("express");
const authorize = require("../../../middlewares/authorize");
const { PERMISSIONS } = require("@packages/shared");
const controller = require("./academicReport.controller");

const router = express.Router();

const canViewReports = authorize(
  PERMISSIONS.VIEW_REPORTS,
  PERMISSIONS.VIEW_REVENUE_REPORTS,
  PERMISSIONS.MANAGE_REPORTS,
  PERMISSIONS.MANAGE_REVENUE_REPORTS,
);

router.get("/summary", canViewReports, controller.getSummary);
router.get("/overview", canViewReports, controller.getOverview);
router.get("/student-performance", canViewReports, controller.getStudentPerformance);
router.get("/student-performance/:studentId", canViewReports, controller.getStudentPerformanceDetail);
router.get("/class-performance", canViewReports, controller.getClassPerformance);
router.get("/section-performance", canViewReports, controller.getSectionPerformance);
router.get("/subject-performance", canViewReports, controller.getSubjectPerformance);
router.get("/exam-analysis", canViewReports, controller.getExamAnalysis);
router.get("/grade-distribution", canViewReports, controller.getGradeDistribution);
router.get("/top-students", canViewReports, controller.getTopStudents);
router.get("/at-risk-students", canViewReports, controller.getAtRiskStudents);
router.get("/academic-progress", canViewReports, controller.getAcademicProgress);
router.get("/export", canViewReports, controller.exportAcademicReport);

module.exports = router;
