const express = require("express");
const authenticate = require("../../middlewares/authenticate");
const authorize = require("../../middlewares/authorize");
const tenantScope = require("../../middlewares/tenantScope");
const { PERMISSIONS } = require("@packages/shared");
const controller = require("./announcement.controller");

const router = express.Router();
router.use(authenticate, tenantScope);
router.use(authorize(PERMISSIONS.MANAGE_ANNOUNCEMENTS, PERMISSIONS.POST_ANNOUNCEMENTS));

router.get("/audience-options", controller.audienceOptions);
router.get("/", controller.listAdmin);
router.post("/", controller.create);
router.get("/:id/statistics", controller.statistics);
router.get("/:id/recipients", controller.recipients);
router.get("/:id", controller.getAdmin);
router.patch("/:id", controller.update);
router.post("/:id/publish", controller.publish);
router.post("/:id/schedule", controller.schedule);
router.post("/:id/cancel", controller.cancel);
router.post("/:id/draft", controller.revertToDraft);
router.post("/:id/archive", controller.archive);
router.post("/:id/expire", controller.expire);

module.exports = router;
