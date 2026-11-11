const express = require("express");
const authenticate = require("../../middlewares/authenticate");
const authorize = require("../../middlewares/authorize");
const tenantScope = require("../../middlewares/tenantScope");
const { PERMISSIONS } = require("@packages/shared");
const controller = require("./department.controller");

const router = express.Router();

router.use(authenticate, tenantScope);

router.get(
  "/head-options",
  authorize(PERMISSIONS.MANAGE_DEPARTMENTS),
  controller.listHeadOptions,
);
router.get("/", authorize(PERMISSIONS.MANAGE_DEPARTMENTS), controller.list);
router.get(
  "/:id",
  authorize(PERMISSIONS.MANAGE_DEPARTMENTS),
  controller.getOne,
);
router.post("/", authorize(PERMISSIONS.MANAGE_DEPARTMENTS), controller.create);
router.patch(
  "/:id",
  authorize(PERMISSIONS.MANAGE_DEPARTMENTS),
  controller.update,
);
router.delete(
  "/:id",
  authorize(PERMISSIONS.MANAGE_DEPARTMENTS),
  controller.remove,
);
router.patch(
  "/:id/status",
  authorize(PERMISSIONS.MANAGE_DEPARTMENTS),
  controller.toggleStatus,
);

module.exports = router;
