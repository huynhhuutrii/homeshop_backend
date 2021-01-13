const jwt = require('jsonwebtoken');
exports.requireLogin = (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(' ')[1]; //lấy nội dung token
    const user = jwt.verify(token, 'abc');
    req.user = user;
  } else {
    return res.status(400).json({ message: 'yêu cầu xác thực' });
  }
  next();
};
exports.userMidleware = (req, res, next) => {
  if (req.user.role !== 'user') {
    return res
      .status(400)
      .json({ message: 'Chỉ có người dùng mới được truy cập' });
  }
  next();
};
exports.adminMidleware = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(400).json({ message: 'Chỉ có admin mới được truy cập' });
  }
  next();
};
