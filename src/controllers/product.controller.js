const Product = require('../models/product.model');
const slugify = require('slugify');
const shortid = require('shortid');
const Category = require('../models/category.model');

exports.getAllProduct = async (req, res) => {
  Product.find({}).exec((err, products) => {
    if (err) {
      return res.status(400).json({ err });
    }
    if (products) {
      return res.status(200).json({ products });
    }
  });
};
exports.deleteProduct = (req, res) => {
  const { id } = req.body;
  Product.findByIdAndDelete({ _id: id }).exec((err, data) => {
    if (err) {
      return res.status(400).json({ err: err.message });
    }
    if (data) {
      return res.status(200).json({ data });
    }
  });
};
exports.updateProduct = async (req, res) => {
  const { _id, name, price, quantity, description, category } = req.body;
  var productImages = [];
  var slug = slugify(name);
  if (req.files && req.files.length > 0) {
    productImages = req.files.map((file) => {
      return { img: file.filename };
    });
  }
  try {
    const intiProduct = await Product.findOne({ _id: _id }, (err, data) => {
      if (err) {
        return res.status(400).json({ err: err.message });
      }
    });
    const intiProductImages = intiProduct.productImages;
    const product = await Product.findOneAndUpdate(
      { _id: _id },
      {
        $set: {
          name: name,
          slug: slug,
          price: price,
          description: description,
          category: category,
          quantity: quantity,
          productImages:
            productImages.length > 0 ? productImages : intiProductImages,
        },
      },
      { new: true }
    )
      .populate('category')
      .exec();
    return res.status(200).json({ product });
  } catch (err) {
    return res.status(400).json({ err: err.message });
  }
};
exports.getDetailProduct = (req, res) => {
  const { id } = req.params;
  Product.findOne({ _id: id })
    .populate('reviews.userID')
    .exec((err, data) => {
      if (err) return res.status(400).json({ err });
      if (data) {
        return res.status(200).json({
          product: data,
        });
      }
    });
};

exports.updateReview = async (req, res) => {
  const { idReview, idProduct, data } = req.body;
  let product = await Product.findOne({ _id: idProduct });
  let updateReviews = product.reviews;
  let index = updateReviews.findIndex((x) => x._id == idReview);
  updateReviews[index].review = data;
  let result = await Product.findOneAndUpdate(
    { _id: idProduct },
    { $set: { reviews: updateReviews } },
    { new: true }
  );
  return res.status(200).json({ result });
};
exports.searchProduct = async (req, res) => {
  const { key } = req.body;
  searchResult = await Product.find({
    name: { $regex: key, $options: '$i' },
  });
  return res.status(200).json({
    searchResult,
  });
};
exports.deleteReview = (req, res) => {
  const { idReview, idProduct } = req.body;
  Product.findByIdAndUpdate(
    {
      _id: idProduct,
    },
    {
      $pull: { reviews: { _id: idReview } },
    },
    { new: true }
  )
    .populate('reviews.userID')
    .exec((err, product) => {
      if (err) {
        return res.status(400).json({ err });
      }
      if (product) {
        res.status(200).json({
          product,
        });
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
          newProducts: data,
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
          err: 'ERROR!',
        });
      }
      if (products) {
        return res.status(200).json({
          products,
        });
      }
    });
};
exports.addReview = (req, res) => {
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
        reviews: {
          $each: [reviewObject],
          $position: 0,
        },
      },
    },
    {
      new: true,
    }
  )
    .populate('reviews.userID')
    .exec((err, data) => {
      if (err || !data) {
        return res.status(400).json({
          message: 'Có lỗi xảy ra',
        });
      }
      return res.status(200).json({
        review: data,
      });
    });
};
exports.getProductBySlug = (req, res) => {
  const { slug, priceRange } = req.params;
  Category.findOne({ slug: slug }).exec((err, category) => {
    if (err) {
      return res.status(400).json({ err });
    }
    if (category) {
      Product.find({ category: category._id }).exec((err, products) => {
        if (err) {
          return res.status(400).json({ err });
        }
        if (products.length >= 0) {
          switch (priceRange) {
            case 'under10M':
              return res.status(200).json({
                listProduct: products.filter(
                  (product) => product.price <= 10000000
                ),
              });
            case 'under30M':
              return res.status(200).json({
                listProduct: products.filter(
                  (product) =>
                    product.price > 10000000 && product.price <= 30000000
                ),
              });
            case 'over30M':
              return res.status(200).json({
                listProduct: products.filter(
                  (product) => product.price > 30000000
                ),
              });
            case 'all':
              return res.status(200).json({ listProduct: products });
          }
        }
      });
    }
  });
};
exports.createProduct = async (req, res) => {
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
  const newProduct = await product.save();
  if (!newProduct) {
    return res.status(400).json({ message: 'Có lỗi xảy ra' });
  }
  const data = await Product.findOne({ _id: newProduct._id })
    .populate('category')
    .exec();
  return res.status(201).json({
    product: data,
  });
  // product.save((err, product) => {
  //   if (err) return res.status(400).json({ err: err.message });
  //   if (product) {
  //     res.status(201).json({ product });
  //   }
  // });
};
