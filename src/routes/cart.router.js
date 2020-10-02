const express = require("express");
const router = express.Router();
const { requireLogin, userMidleware } = require("../common");

const { addItemToCart } = require("../controllers/cart.controller");

router.post("/cart/addtocart", requireLogin, userMidleware, addItemToCart);

module.exports = router;
