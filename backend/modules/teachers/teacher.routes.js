const express = require("express");
const authenticate = require("../../middlewares/authenticate");
const authorize = require("../../middlewares/authorize");
const tenantScope = require("../../middlewares/tenantScope");
const { PERMISSIONS } = require("@packages/shared");
const controller = require("./teacher.controller");

const router = express.Router();

router.use(authenticate, tenantScope);

router.get(
  "/classes",
  authorize(PERMISSIONS.MANAGE_TEACHERS),
  controller.listClasses,
);
router.get("/", authorize(PERMISSIONS.MANAGE_TEACHERS), controller.list);
router.get("/:id", authorize(PERMISSIONS.MANAGE_TEACHERS), controller.getOne);
router.post("/", authorize(PERMISSIONS.MANAGE_TEACHERS), controller.create);
router.patch("/:id", authorize(PERMISSIONS.MANAGE_TEACHERS), controller.update);
router.delete("/:id", authorize(PERMISSIONS.MANAGE_TEACHERS), controller.remove);
router.patch(
  "/:id/status",
  authorize(PERMISSIONS.MANAGE_TEACHERS),
  controller.toggleStatus,
);

module.exports = router;
