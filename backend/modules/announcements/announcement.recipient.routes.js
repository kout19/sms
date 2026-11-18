const express = require("express");
const authenticate = require("../../middlewares/authenticate");
const authorize = require("../../middlewares/authorize");
const tenantScope = require("../../middlewares/tenantScope");
const { PERMISSIONS } = require("@packages/shared");
const controller = require("./announcement.controller");

const router = express.Router();
router.use(authenticate, tenantScope, authorize(PERMISSIONS.VIEW_ANNOUNCEMENTS));
router.get("/unread-count", controller.unreadCount);
router.get("/", controller.listInbox);
router.get("/:id", controller.getInbox);
router.patch("/:id/read", controller.markRead);
router.patch("/:id/unread", controller.markUnread);

module.exports = router;
