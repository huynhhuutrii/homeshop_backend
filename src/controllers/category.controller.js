const Category = require('../models/category.model');
const Product = require('../models/product.model');
const slugify = require('slugify');
const shortId = require('shortid');
function createCagories(categories, parentID = null) {
  const listCategory = [];
  let category;
  if (parentID == null) {
    category = categories.filter((cat) => cat.parentID == undefined);
  } else {
    category = categories.filter((cat) => cat.parentID == parentID);
  }
  for (let item of category) {
    listCategory.push({
      _id: item._id,
      name: item.name,
      slug: item.slug,
      parentID: item.parentID,
      categoryImage: item.categoryImage,
      children: createCagories(categories, item._id),
    });
  }
  return listCategory;
}
exports.deleteCategory = async (req, res) => {
  const id = req.body.id;
  try {
    const cat = await Category.findOne({ _id: id });
    if (!cat) {
      return res.status(400).json({ message: 'Not found' });
    }
    if (cat.parentID && cat.parentID !== id) {
      return res.status(400).json({ message: 'Not found' });
    } else {
      await Category.deleteOne({ _id: cat._id });
      await Category.deleteMany({ parentID: cat._id });
      await Product.deleteMany({ category: cat._id });
    }
    return res.status(200).json({ message: 'Xóa thành công' });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};
exports.updateCategory = (req, res) => {
  const cat = req.body;
  Category.findOneAndUpdate({ _id: cat._id }, cat, {
    new: true,
  }).exec((err, category) => {
    if (err) {
      return res.status(400).json({ err });
    }
    if (category) {
      return res.status(201).json({
        message: 'cập nhật danh mục thành công',
      });
    }
  });
};
exports.createCategory = async (req, res) => {
  const check = await Category.findOne({ name: req.body.name });
  if (check) {
    return res.status(400).json({ errors: 'Danh mục đã tồn tại' });
  }

  const categoryObject = {
    name: req.body.name,
    slug: `${shortId.generate()}-${slugify(req.body.name)}`,
  };
  if (req.body.parentID) {
    categoryObject.parentID = req.body.parentID;
  }
  if (req.file) {
    categoryObject.categoryImage =
      process.env.IMAGE_URL + '/' + req.file.filename;
  }
  const newCat = new Category(categoryObject);
  newCat.save((err, category) => {
    if (err) {
      return res.status(400).json({
        err,
      });
    }
    if (category) {
      return res.status(201).json({
        category,
      });
    }
  });
};
exports.getCategories = (req, res) => {
  Category.find({}).exec((err, categories) => {
    if (err) return res.status(400).json({ err });
    if (categories) {
      const listCategory = createCagories(categories);
      return res.status(200).json({
        listCategory,
      });
    }
  });
};
