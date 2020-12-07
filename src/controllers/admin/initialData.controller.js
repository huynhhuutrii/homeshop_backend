const Category = require('../../models/category.model');
const Product = require('../../models/product.model');
const User = require('../../models/user.model');
const Order = require('../../models/order.model');
exports.homeData = async (req, res) => {
  const categories = await Category.find({});
  const products = await Product.find({});
  const users = await User.find({});
  const orders = await Order.find({});
  return res.status(200).json({
    homeData: {
      categories: categories.length,
      products: products.length,
      users: users.length,
      orders: orders.length,
    },
  });
};

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
exports.initialData = async (req, res) => {
  const categories = await Category.find({}).exec();
  const products = await Product.find({})
    .select('_id name price quantity slug description productImages category')
    .populate('category')
    .exec();
  res.status(200).json({
    categories: createCagories(categories),
    products,
  });
};
