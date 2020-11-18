const express = require('express');
const router = express.Router();
const path = require('path');
const { requireLogin, adminMidleware } = require('../common');

const {
  createProduct,
  getProductBySlug,
  addReview,
  getDetailProduct,
  getRandomProduct,
  getNewProductList,
  deleteReview,
  updateReview,
  searchProduct,
  getAllProduct,
  deleteProduct,
  updateProduct,
} = require('../controllers/product.controller');
const shortid = require('shortid');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(path.dirname(__dirname), 'uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, shortid.generate() + '-' + file.originalname);
  },
});
const upload = multer({ storage });
router.post(
  '/product/createproduct',
  requireLogin,
  adminMidleware,
  upload.array('productImage'),
  createProduct
);
router.get('/product/:slug/:priceRange', getProductBySlug);
router.get('/product/random', getRandomProduct);
router.get('/product/new', getNewProductList);
router.put('/product/review/add', requireLogin, addReview);
router.post('/product/detail/:id', getDetailProduct);
router.put('/product/review/delete', deleteReview);
router.patch('/product/review/update', updateReview);
router.post('/product/search', searchProduct);
router.get('/product/all', getAllProduct);
router.post('/product/delete', requireLogin, adminMidleware, deleteProduct);
router.put(
  '/product/update',
  requireLogin,
  adminMidleware,
  upload.array('productImage'),
  updateProduct
);
module.exports = router;
