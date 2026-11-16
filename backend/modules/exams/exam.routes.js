const express = require("express");
const authenticate = require("../../middlewares/authenticate");
const authorize = require("../../middlewares/authorize");
const tenantScope = require("../../middlewares/tenantScope");
const { PERMISSIONS } = require("@packages/shared");
const controller = require("./exam.controller");

const router = express.Router();

router.use(authenticate, tenantScope);
router.use(authorize(PERMISSIONS.MANAGE_EXAMS));

router.get("/options", controller.options);
router.get("/stats", controller.stats);
router.get("/", controller.list);
router.post("/", controller.create);
router.get("/:id", controller.getOne);
router.patch("/:id", controller.update);
router.delete("/:id", controller.remove);

module.exports = router;
