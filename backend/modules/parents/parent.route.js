const express = require("express");
const authenticate = require("../../middlewares/authenticate");
const authorize = require("../../middlewares/authorize");
const tenantScope = require("../../middlewares/tenantScope");
const { PERMISSIONS } = require("@packages/shared");
const controller = require("./parent.controller");

const router = express.Router();

router.use(authenticate, tenantScope);

router.get(
  "/student-options",
  authorize(PERMISSIONS.MANAGE_PARENTS),
  controller.studentOptions,
);
router.get("/", authorize(PERMISSIONS.VIEW_PARENTS), controller.list);
router.get("/:id", authorize(PERMISSIONS.VIEW_PARENTS), controller.getOne);
router.post("/", authorize(PERMISSIONS.MANAGE_PARENTS), controller.create);
router.patch("/:id", authorize(PERMISSIONS.MANAGE_PARENTS), controller.update);
router.put(
  "/:id/students",
  authorize(PERMISSIONS.MANAGE_PARENTS),
  controller.updateStudents,
);
router.patch(
  "/:id/status",
  authorize(PERMISSIONS.MANAGE_PARENTS),
  controller.setStatus,
);

module.exports = router;