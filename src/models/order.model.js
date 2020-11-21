//collection Order
const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema(
  {
    //order user tham chiếu đến collection user
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    //nguoi nhan hang
    receiver: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['Chưa thanh toán', 'Đã thanh toán', 'Đã hủy'],
      default: 'Chưa thanh toán',
    },
    method: {
      type: String,
      enum: ['Khi giao hàng', 'trực tuyến'],
      default: 'Khi giao hàng',
    },
    //ghi chu
    note: {
      type: String,
    },
    //Các product mà user đã order
    cartItems: [
      {
        //thông tin product tham chiếu đến collection
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        quantity: { type: Number, default: 1, required: true },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);
//tạo model
module.exports = mongoose.model('Order', orderSchema);
