const Product = require("../models/product.model");
const slugify = require("slugify");
const shortid = require("shortid");
const Category = require("../models/category.model");
exports.getDetailProduct = (req, res) => {
  const { id } = req.params;
  Product.findOne({ _id: id })
    .populate("reviews.userID")
    .exec((err, data) => {
      if (err) return res.status(400).json({ err });
      if (data) {
        return res.status(200).json({
          product: data,
        });
      }
    });
};
exports.deleteReview = (req, res) => {
  const { reviewID } = req.body;

  Product.findOne({ "reviews._id": reviewID }).exec((err, review) => {
    if (review) {
      res.status(200).json({ review });
    }
  });
};
exports.getNewProductList = (req, res) => {
  Product.find({})
    .sort({ createdAt: -1 })
    .limit(6)
    .exec((err, data) => {
      if (err) {
        return res.status(400).json({
          err,
        });
      }
      if (data) {
        return res.status(200).json({
          data,
        });
      }
    });
};
exports.getRandomProduct = (req, res) => {
  Product.find({})
    .limit(6)
    .exec((err, products) => {
      if (err) {
        return res.status(400).json({
          err: "ERROR!",
        });
      }
      if (products) {
        return res.status(200).json({
          products,
        });
      }
    });
};
exports.review = (req, res) => {
  const { id, comment, stars } = req.body;
  const reviewObject = {
    userID: req.user._id,
    review: comment,
    rating: stars,
  };
  Product.findByIdAndUpdate(
    {
      _id: id,
    },
    {
      $push: {
        reviews: reviewObject,
      },
    },
    {
      new: true,
    }
  )
    .populate("reviews.userID")
    .exec((err, data) => {
      if (err || !data) {
        return res.status(400).json({
          message: "Có lỗi xảy ra",
        });
      }
      return res.status(200).json({
        review: data,
      });
    });
};
exports.getProductBySlug = (req, res) => {
  const { slug } = req.params;
  Category.findOne({ slug: slug }).exec((err, category) => {
    if (err) {
      return res.status(400).json({ err });
    }
    if (category) {
      Product.find({ category: category._id }).exec((err, products) => {
        if (err) {
          return res.status(400).json({ err });
        }
        if (products.length > 0) {
          res.status(200).json({
            products,
            productByPrice: {
              under10M: products.filter((product) => product.price <= 10000000),
              under30M: products.filter(
                (product) =>
                  product.price > 10000000 && product.price <= 30000000
              ),
              over30M: products.filter((product) => product.price > 30000000),
            },
          });
        }
      });
    }
  });
};
exports.createProduct = (req, res) => {
  const { name, price, description, category, quantity } = req.body;
  var productImages = [];
  if (req.files.length > 0) {
    productImages = req.files.map((file) => {
      return { img: file.filename };
    });
  }

  const product = new Product({
    name: name,
    slug: slugify(name),
    price,
    description,
    productImages,
    category,
    quantity,
    createdBy: req.user._id,
  });

  product.save((err, product) => {
    if (err) return res.status(400).json({ err });
    if (product) {
      res.status(201).json({ product });
    }
  });
};
