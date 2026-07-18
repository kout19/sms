const express = require("express");
const {
  loginController,
  logoutController,
  refreshTokenController,
} = require("./auth.controller");

const router = express.Router();

router.post("/login", loginController);
router.post("/logout", logoutController);
router.post("/refresh-token", refreshTokenController);

module.exports = router;
