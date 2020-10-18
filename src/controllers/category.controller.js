const Category = require("../models/category.model");
const slugify = require("slugify");
const { updateMany } = require("../models/category.model");
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
exports.deleteCategories = (req, res) => {
  res.status(200).json({
    body: req.body
  })
}
exports.updateCategory = async (req, res) => {
  const { _id, name, parentID, type } = req.body;
  const updateCategories = [];
  if (name instanceof Array) {
    for (let i = 0; i < name.length; i++) {
      const category = {
        name: name[i],
        type: type[i]
      }
      if (parentID[i] !== "") {
        category.parentID = parentID[i];

      }
      updateCategory = await Category.findOneAndUpdate({ _id: _id[i] }, category, { new: true })
      updateCategories.push(updateCategory);
    }
    return res.status(201).json({ updateCategories })
  } else {
    const category = {
      name, type
    }
    if (parentID !== "") {
      category.parentID = parentID;
    }
    updateCategories = await Category.findOneAndUpdate({ _id: _id }, category, { new: true })

    return res.status(201).json({ updateCategories })
  }
}
exports.createCategory = (req, res) => {
  const categoryObject = {
    name: req.body.name,
    slug: slugify(req.body.name),
  };
  if (req.body.parentID) {
    categoryObject.parentID = req.body.parentID;
  }
  if (req.file) {
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
