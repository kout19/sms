const express = require("express");
const authenticate = require("../../middlewares/authenticate");
const authorize = require("../../middlewares/authorize");
const tenantScope = require("../../middlewares/tenantScope");
const { PERMISSIONS } = require("@packages/shared");
const controller = require("./accountant.controller");

const router = express.Router();

router.use(authenticate, tenantScope);

router.get(
  "/overview",
  authorize(PERMISSIONS.MANAGE_USERS),
  controller.overview,
);
router.get("/", authorize(PERMISSIONS.MANAGE_USERS), controller.list);
router.get("/:id", authorize(PERMISSIONS.MANAGE_USERS), controller.getOne);
router.post("/", authorize(PERMISSIONS.MANAGE_USERS), controller.create);
router.patch("/:id", authorize(PERMISSIONS.MANAGE_USERS), controller.update);
router.patch(
  "/:id/status",
  authorize(PERMISSIONS.MANAGE_USERS),
  controller.setStatus,
);

module.exports = router;
