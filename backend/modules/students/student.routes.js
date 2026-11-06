const express = require("express");
const authenticate = require("../../middlewares/authenticate");
const authorize = require("../../middlewares/authorize");
const tenantScope = require("../../middlewares/tenantScope");
const { PERMISSIONS } = require("@packages/shared");
const controller = require("./student.controller");

const router = express.Router();

router.use(authenticate, tenantScope);

router.get("/", authorize(PERMISSIONS.VIEW_STUDENTS), controller.list);
router.get("/:id", authorize(PERMISSIONS.VIEW_STUDENTS), controller.getOne);
router.post("/", authorize(PERMISSIONS.MANAGE_STUDENTS), controller.create);
router.patch("/:id", authorize(PERMISSIONS.MANAGE_STUDENTS), controller.update);
router.delete("/:id", authorize(PERMISSIONS.MANAGE_STUDENTS), controller.remove);
router.patch("/:id/status", authorize(PERMISSIONS.MANAGE_STUDENTS), controller.toggleStatus);

module.exports = router;
