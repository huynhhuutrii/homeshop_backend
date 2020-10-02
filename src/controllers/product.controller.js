const Product = require("../models/product.model");
const slugify = require("slugify");
const shortid = require("shortid");
exports.createProduct = (req, res) => {
  const { name, price, description, category, quantity, createdBy } = req.body;
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
