const express = require("express");
const authenticate = require("../../middlewares/authenticate");
const authorize = require("../../middlewares/authorize");
const tenantScope = require("../../middlewares/tenantScope");
const { PERMISSIONS } = require("@packages/shared");
const controller = require("./class.controller");

const router = express.Router();
router.use(authenticate, tenantScope);

router.get("/", authorize(PERMISSIONS.MANAGE_CLASSES), controller.list);
router.get("/:classId/sections", authorize(PERMISSIONS.MANAGE_CLASSES), controller.listSections);
router.post("/:classId/sections", authorize(PERMISSIONS.MANAGE_CLASSES), controller.createSection);
router.get("/:id", authorize(PERMISSIONS.MANAGE_CLASSES), controller.getOne);
router.post("/", authorize(PERMISSIONS.MANAGE_CLASSES), controller.create);
router.patch("/:id", authorize(PERMISSIONS.MANAGE_CLASSES), controller.update);
router.patch("/:id/status", authorize(PERMISSIONS.MANAGE_CLASSES), controller.updateStatus);

module.exports = router;
