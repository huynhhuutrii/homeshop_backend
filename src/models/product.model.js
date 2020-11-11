//collection Product
const mongoose = require('mongoose');
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    //đường dẫn hiễn thị trên thanh url của product đó
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    //giá
    price: {
      type: Number,
      required: true,
    },
    //mô tả
    description: {
      type: String,
      required: true,
      trim: true,
    },
    //số lượng
    quantity: {
      type: Number,
      required: true,
    },
    //danh sách ảnh của sản phẩm

    productImages: [{ img: { type: String } }],
    //danh sách đánh giá của client
    reviews: [
      {
        //thông tin client
        userID: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        //nội dung đánh giá
        review: {
          type: String,
          required: true,
        },
        //số sao đánh giá
        rating: {
          type: Number,
          required: true,
          default: 0,
        },
      },
    ],
    //danh mục của sản phẩm đó
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    //user tạo sản phẩm
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    //ngày update
    updateAt: Date,
  },
  //thêm các thuộc tính ngày tạo và ngày update
  { timestamps: true }
);
//tạo model
module.exports = mongoose.model('Product', productSchema);
