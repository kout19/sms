const express = require("express");
const authenticate = require("../../middlewares/authenticate");
const authorize = require("../../middlewares/authorize");
const tenantScope = require("../../middlewares/tenantScope");
const { PERMISSIONS } = require("@packages/shared");
const controller = require("./section.controller");

const router = express.Router();
router.use(authenticate, tenantScope);

router.get("/:id", authorize(PERMISSIONS.MANAGE_CLASSES), controller.getOne);
router.patch("/:id", authorize(PERMISSIONS.MANAGE_CLASSES), controller.update);
router.patch("/:id/status", authorize(PERMISSIONS.MANAGE_CLASSES), controller.updateStatus);

module.exports = router;
