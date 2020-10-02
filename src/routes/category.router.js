const express = require("express");
const { requireLogin, adminMidleware } = require("../common");
const router = express.Router();
const {
  createCategory,
  getCategories,
} = require("../controllers/category.controller");
const shortid = require("shortid");
const multer = require("multer");
const path = require("path");
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
"/category/create", 
requireLogin, 
adminMidleware, 
upload.single("categoryImage"), 
createCategory
);

router.get("/category/getcategory", getCategories);
module.exports = router;
