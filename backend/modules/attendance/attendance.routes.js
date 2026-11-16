const express = require("express");
const authenticate = require("../../middlewares/authenticate");
const authorize = require("../../middlewares/authorize");
const tenantScope = require("../../middlewares/tenantScope");
const { PERMISSIONS } = require("@packages/shared");
const controller = require("./attendance.controller");
const reportController = require("./attendanceReport.controller");

const router = express.Router();
router.use(authenticate, tenantScope);

router.get(
  "/reports/options",
  authorize(PERMISSIONS.VIEW_ATTENDANCE),
  reportController.getOptions,
);
router.get(
  "/reports/export",
  authorize(PERMISSIONS.VIEW_ATTENDANCE),
  reportController.exportReport,
);
router.get(
  "/reports/students",
  authorize(PERMISSIONS.VIEW_ATTENDANCE),
  reportController.getStudents,
);
router.get(
  "/reports/records",
  authorize(PERMISSIONS.VIEW_ATTENDANCE),
  reportController.getRecords,
);
router.get(
  "/reports/detail",
  authorize(PERMISSIONS.VIEW_ATTENDANCE),
  reportController.getDetail,
);
router.get(
  "/reports",
  authorize(PERMISSIONS.VIEW_ATTENDANCE),
  reportController.getReport,
);

router.get("/stats", authorize(PERMISSIONS.VIEW_ATTENDANCE), controller.getSummary);
router.get("/trend", authorize(PERMISSIONS.VIEW_ATTENDANCE), controller.getTrend);
router.get("/today-breakdown", authorize(PERMISSIONS.VIEW_ATTENDANCE), controller.getTodayBreakdown);
router.get("/register", authorize(PERMISSIONS.VIEW_ATTENDANCE), controller.getRegister);
router.get("/sessions", authorize(PERMISSIONS.VIEW_ATTENDANCE), controller.listSessions);
router.get("/sessions/:id", authorize(PERMISSIONS.VIEW_ATTENDANCE), controller.getSession);
router.get("/", authorize(PERMISSIONS.VIEW_ATTENDANCE), controller.getRecords);
router.post("/sessions", authorize(PERMISSIONS.MARK_ATTENDANCE), controller.saveSession);
router.post("/bulk-mark", authorize(PERMISSIONS.MARK_ATTENDANCE), controller.bulkMark);
router.patch("/bulk-status", authorize(PERMISSIONS.MARK_ATTENDANCE), controller.bulkUpdate);
router.patch("/:id/status", authorize(PERMISSIONS.MARK_ATTENDANCE), controller.updateStatus);
router.delete("/sessions/:id", authorize(PERMISSIONS.MARK_ATTENDANCE), controller.deleteSession);

module.exports = router;
