const User = require('../../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
exports.register = (req, res) => {
  User.findOne({ email: req.body.email }).exec(async (err, user) => {
    if (user) {
      return res.status(400).json({
        errors: 'user ivalid',
      });
    }
    const { name, username, email, password } = req.body;
    const hash_password = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      username,
      email,
      hash_password,
      role: 'admin',
    });
    newUser.save((err, data) => {
      if (err) {
        return res.status(400).json({
          errors: 'Error!',
        });
      }
      if (data) {
        return res.status(201).json({
          message: 'tạo tài khoảng thành công',
        });
      }
    });
  });
};
exports.login = (req, res) => {
  User.findOne({ email: req.body.email }).exec((err, user) => {
    if (err) return res.status(400).json({ error });
    if (user) {
      if (user.authenticate(req.body.password) && user.role == 'admin') {
        const token = jwt.sign({ _id: user._id, role: user.role }, 'abc', {
          expiresIn: '2d',
        });
        const { _id, name, username, email, role } = user;
        res.cookie('token', token, { expiresIn: '2h' });
        res.status(200).json({
          token,
          user: {
            _id,
            name,
            username,
            email,
            role,
          },
        });
      } else {
        return res.status(400).json({
          errors: 'sai mật khẩu',
        });
      }
    } else {
      return res.status(400).json({ errors: 'tài khoản không tồn tại' });
    }
  });
};
exports.getAllUser = (req, res) => {
  User.find({}).exec((err, data) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    if (data) {
      return res.status(200).json({ users: data });
    }
  });
};
exports.deleteUser = async (req, res) => {
  const { id } = req.body;
  try {
    const users = await User.deleteOne({ _id: id });
    if (users) {
      return res.status(200).json({ message: 'Đã xóa người dùng thành công' });
    }
  } catch (err) {
    return res.status(400).json({ err: err.message });
  }
};
exports.logout = (req, res) => {
  res.clearCookie('token');
  res.status(200).json({
    message: 'Đăng xuất thành công',
  });
};
