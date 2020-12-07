const express = require('express');
const router = express.Router();
const {
  initialData,
  homeData,
} = require('../../controllers/admin/initialData.controller');
router.get('/initialdata', initialData);
router.get('/home/data', homeData);
module.exports = router;
