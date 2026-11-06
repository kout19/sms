const express = require("express");
const authenticate = require("../../middlewares/authenticate");
const authorize = require("../../middlewares/authorize");
const tenantScope = require("../../middlewares/tenantScope");
const { PERMISSIONS } = require("@packages/shared");
const controller = require("./admin.controller");

const router = express.Router();

router.use(authenticate, tenantScope);

router.get("/overview", authorize(PERMISSIONS.VIEW_DASHBOARD), controller.getOverview);

module.exports = router;
