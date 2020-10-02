const Category = require("../models/category.model");
const slugify = require("slugify");
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
      children: createCagories(categories, item._id),
    });
  }
  return listCategory;
}

exports.createCategory = (req, res) => {
  const categoryObject = {
    name: req.body.name,
    slug: slugify(req.body.name),
  };
  if (req.body.parentID) {
    categoryObject.parentID = req.body.parentID;
  }
  if(req.file){
    categoryObject.categoryImage = process.env.IMAGE_URL + "/" + req.file.filename;
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
