const express = require('express');
const router = express.Router();
const {
  order,
  getOrders,
  getAllOrder,
  updateOrder,
} = require('../controllers/order.controller');
const { requireLogin } = require('../common');

router.post('/order', requireLogin, order);
router.post('/order/list', getOrders);
router.get('/order/all', getAllOrder);
router.put('/order/update', updateOrder);
module.exports = router;
