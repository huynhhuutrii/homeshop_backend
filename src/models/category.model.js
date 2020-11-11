//collect category
const mongoose = require('mongoose');
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    //đường dẫn của danh mục trên url
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    //ảnh của danh mục
    categoryImage: {
      type: String,
    },
    //danh mục cha của danh mục
    parentID: {
      type: String,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model('Category', categorySchema);
