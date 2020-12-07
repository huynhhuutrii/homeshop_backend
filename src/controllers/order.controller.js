const Order = require('../models/order.model');

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.body.userID });
    if (!orders) {
      return res.status(400).json({ message: 'Bạn chưa có đơn hàng nào' });
    }
    return res.status(200).json({
      listOrder: orders,
    });
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    });
  }
};
exports.updateOrder = async (req, res) => {
  const { idOrder } = req.body;
  Order.findOneAndUpdate(
    {
      _id: idOrder,
    },
    {
      $set: {
        status: 'Đã thanh toán',
      },
    },
    {
      new: true,
    }
  ).exec((err, data) => {
    if (err) {
      return res.status(400).json({ err: err.message });
    }
    if (data) {
      return res.status(200).json({ updateOrder: data });
    }
  });
};
exports.purchasedProduct = async (req, res) => {
  const orders = await Order.find({
    user: req.body.userID,
    status: 'Đã thanh toán',
  })
    .populate('cartItems.product')
    .exec();
  if (!orders) {
    return res.status(400).json({ errors: 'Bạn chưa mua sản phẩm nào' });
  }
  const products = [];
  for (order of orders) {
    for (item of order.cartItems) {
      products.push(item.product);
    }
  }
  return res.status(200).json({ products });
};
exports.getAllOrder = async (req, res) => {
  try {
    allOrder = await Order.find({}).sort({ createdAt: -1 });
    if (!allOrder) {
      return res.status(400).json({ message: 'Không tìm thấy đơn hàng nào' });
    }
    return res.status(200).json({
      allOrder,
    });
  } catch (err) {
    return res.status(400).json({
      err: err.message,
    });
  }
};
exports.searchOrder = async (req, res) => {
  const { key } = req.body;

  searchResult = await Order.find({
    phone: { $regex: key, $options: '$i' },
  });
  return res.status(200).json({
    searchResult,
  });
};
exports.deleteOrder = (req, res) => {
  const id = req.body.id;
  Order.deleteOne({ _id: id }).exec((err, data) => {
    if (err) {
      return res.status(400).json({ err: err.message });
    }
    if (data) {
      return res.status(200).json({ message: 'Xóa thành công' });
    }
  });
};
exports.cancelOrder = (req, res) => {
  const id = req.body.id;
  Order.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        status: 'Đã hủy',
      },
    },
    { new: true }
  ).exec((err, data) => {
    if (err) {
      return res.status(400).json({ err: err.message });
    }
    if (data) {
      return res.status(200).json({ order: data });
    }
  });
};
exports.order = (req, res) => {
  const {
    receiver,
    email,
    phone,
    address,
    note,
    cartItems,
    totalPrice,
  } = req.body;

  const newCart = [];
  if (cartItems.length > 0) {
    cartItems.map((item) => {
      newCart.push({
        product: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      });
    });
  }

  const newOrder = new Order({
    user: req.user._id,
    receiver,
    phone,
    email,
    address,
    status: 'Chưa thanh toán',
    note,
    cartItems: newCart,
    totalPrice,
  });
  newOrder.save((err, order) => {
    if (err) {
      return res.status(400).json({
        err: 'có lỗi xảy ra',
      });
    } else {
      if (order) {
        return res.status(201).json({
          newOrder,
        });
      }
    }
  });
};
