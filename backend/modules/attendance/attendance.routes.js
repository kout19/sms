const express = require("express");
const authenticate = require("../../middlewares/authenticate");
const authorize = require("../../middlewares/authorize");
const tenantScope = require("../../middlewares/tenantScope");
const { PERMISSIONS } = require("@packages/shared");
const controller = require("./attendance.controller");

const router = express.Router();
router.use(authenticate, tenantScope);

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
