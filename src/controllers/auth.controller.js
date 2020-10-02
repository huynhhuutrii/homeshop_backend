const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
exports.register = (req, res) => {
  User.findOne({ email: req.body.email }).exec((err, user) => {
    if (user) {
      return res.status(400).json({
        message: "user ivalid",
      });
    }
    const { username, email, password } = req.body;
    const newUser = new User({
      username,
      email,
      password,
      role: "user",
    });
    newUser.save((err, data) => {
      if (err) {
        return res.status(400).json({
          message: "Error!",
        });
      }
      if (data) {
        return res.status(201).json({
          message: "tạo tài khoảng thành công",
        });
      }
    });
  });
};
exports.login = (req, res) => {
  User.findOne({ email: req.body.email }).exec((err, user) => {
    if (err) return res.status(400).json({ error });
    if (user) {
      if (user.authenticate(req.body.password)) {
        const token = jwt.sign({ _id: user._id, role: user.role }, "abc", {
          expiresIn: "5d",
        });
        const { _id, username, email, role } = user;
        res.status(200).json({
          token,
          user: {
            _id,
            username,
            email,
            role,
          },
        });
      } else {
        return res.status(400).json({
          message: "sai mật khẩu",
        });
      }
    } else {
      return res.status(400).json({ message: "tài khoản không tồn tại" });
    }
  });
};
