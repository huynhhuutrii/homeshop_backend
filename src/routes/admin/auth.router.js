const express = require('express');
const router = express.Router();
const {
  validateRegister,
  isValidated,
  validateLogin,
} = require('../../validators/auth');
const {
  register,
  login,
  logout,
  getAllUser,
  deleteUser,
} = require('../../controllers/admin/auth.controller');
const { requireLogin, adminMidleware } = require('../../common');

module.exports = router;

router.post('/admin/register', validateRegister, isValidated, register);
router.get('/user/all', requireLogin, adminMidleware, getAllUser);
router.post('/user/delete', requireLogin, adminMidleware, deleteUser);
router.post('/admin/login', validateLogin, isValidated, login);
router.post('/admin/logout', logout);
