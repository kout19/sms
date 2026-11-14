const express = require("express");
const authenticate = require("../../middlewares/authenticate");
const authorize = require("../../middlewares/authorize");
const tenantScope = require("../../middlewares/tenantScope");
const { PERMISSIONS } = require("@packages/shared");
const controller = require("./subject.controller");

const router = express.Router();

router.use(authenticate, tenantScope);

router.get("/", authorize(PERMISSIONS.MANAGE_SUBJECTS), controller.list);
router.get("/options", authorize(PERMISSIONS.MANAGE_SUBJECTS), controller.listOptions);
router.get("/:id", authorize(PERMISSIONS.MANAGE_SUBJECTS), controller.getOne);
router.post("/", authorize(PERMISSIONS.MANAGE_SUBJECTS), controller.create);
router.patch("/:id", authorize(PERMISSIONS.MANAGE_SUBJECTS), controller.update);
router.delete("/:id", authorize(PERMISSIONS.MANAGE_SUBJECTS), controller.remove);
router.patch("/:id/status", authorize(PERMISSIONS.MANAGE_SUBJECTS), controller.toggleStatus);

module.exports = router;
