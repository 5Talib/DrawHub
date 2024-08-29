const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getCurrentUser,
  logout,
} = require("../controllers/auth");

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/user").post(getCurrentUser);
router.route("/logout").post(logout);

module.exports = router;
