const express = require("express");
const router = express.Router();
const {
  validateRegister,
  isValidated,
  validateLogin,
} = require("../../validators/auth");
const { register, login } = require("../../controllers/admin/auth.controller");
module.exports = router;

router.post("/admin/register", validateRegister, isValidated, register);

router.post("/admin/login", validateLogin, isValidated, login);
