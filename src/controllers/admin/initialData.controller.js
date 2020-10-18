const Category = require("../../models/category.model");
const Product = require("../../models/product.model");

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
      children: createCagories(categories, item._id),
    });
  }
  return listCategory;
}
exports.initialData = async (req, res) => {
  const categories = await Category.find({}).exec();
  const products = await Product.find({})
    .select("_id name price quantity slug description productImages category")
    .populate("category")
    .exec();
  res.status(200).json({
    categories: createCagories(categories),
    products
  })

}