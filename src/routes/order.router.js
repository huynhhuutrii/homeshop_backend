const express = require('express');

const router = express.Router();
const {
  order,
  getOrders,
  getAllOrder,
  updateOrder,
  deleteOrder,
  searchOrder,
  purchasedProduct,
  cancelOrderByCus,
} = require('../controllers/order.controller');
const { requireLogin } = require('../common');

router.post('/order', requireLogin, order);
router.post('/order/list', requireLogin, getOrders);
router.get('/order/all', getAllOrder);
router.put('/order/update', updateOrder);
router.post('/order/delete', deleteOrder);
router.post('/order/search', searchOrder);
router.post('/review/purchased', requireLogin, purchasedProduct);
router.put('/order/cancel', cancelOrderByCus);
module.exports = router;
