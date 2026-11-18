const express = require("express");
const authenticate = require("../../middlewares/authenticate");
const authorize = require("../../middlewares/authorize");
const tenantScope = require("../../middlewares/tenantScope");
const { PERMISSIONS } = require("@packages/shared");
const controller = require("./message.controller");

const router = express.Router();

router.use(authenticate, tenantScope);

const canView = authorize(PERMISSIONS.VIEW_MESSAGES, PERMISSIONS.MANAGE_MESSAGES);
// Sending/replying is available to any authenticated school user (they all hold
// VIEW_MESSAGES). The service enforces who is actually allowed to reply to a
// given message and guarantees every recipient shares the school tenant.
const canSend = authorize(PERMISSIONS.VIEW_MESSAGES, PERMISSIONS.MANAGE_MESSAGES);

router.get("/recipients", canView, controller.recipients);
router.get("/unread-count", canView, controller.unreadCount);
router.get("/inbox", canView, controller.listInbox);
router.get("/sent", canView, controller.listSent);
router.get("/thread/:id", canView, controller.getThread);
router.get("/:id", canView, controller.getOne);

router.post("/", canSend, controller.create);
router.post("/:id/reply", canSend, controller.reply);

router.patch("/:id/read", canView, controller.markRead);
router.patch("/:id/unread", canView, controller.markUnread);
router.patch("/:id/archive", canView, controller.archive);
router.patch("/:id/unarchive", canView, controller.unarchive);

router.delete("/:id", canView, controller.remove);

module.exports = router;
