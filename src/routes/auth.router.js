const express = require("express");
const router = express.Router();
const {
  validateRegister,
  isValidated,
  validateLogin,
} = require("../validators/auth");
const { register, login } = require("../controllers/auth.controller");
module.exports = router;

router.post("/register", validateRegister, isValidated, register);

router.post("/login", validateLogin, isValidated, login);

// router.post("/profile", requireLogin);
