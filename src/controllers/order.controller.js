const Order = require('../models/order.model');
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
