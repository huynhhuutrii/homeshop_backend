const express = require('express');
const router = express.Router();
const {
  initialData,
} = require('../../controllers/admin/initialData.controller');
router.get('/initialdata', initialData);

module.exports = router;
