const express = require("express");
const router = express.Router();
const path = require("path");
const { requireLogin, adminMidleware } = require("../common");

const { createProduct } = require("../controllers/product.controller");
const {
  createCategory,
  getCategories,
} = require("../controllers/category.controller");
const shortid = require("shortid");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(path.dirname(__dirname), "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, shortid.generate() + "-" + file.originalname);
  },
});
const upload = multer({ storage });
router.post(
  "/product/createproduct",
  requireLogin,
  adminMidleware,
  upload.array("productImage"),
  createProduct
);

//router.get("/category/getcategory", getCategories);
module.exports = router;
