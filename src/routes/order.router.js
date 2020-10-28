const express = require("express");
const router = express.Router();
const { order } = require("../controllers/order.controller");
const { requireLogin } = require("../common");

router.post("/order", requireLogin, order);
module.exports = router;