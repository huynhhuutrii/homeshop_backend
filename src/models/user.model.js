//collection user
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
//khởi tạo shema để khai báo thuộc tính cho collection user
const userShema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    //password lưu dưới dạng mã hóa
    hash_password: {
      type: String,
      require: true,
    },
    //phân quyền user và admin
    role: {
      type: String,
      enum: ['user', 'admin'],
      defautl: 'user',
    },
  },
  { timestamps: true }
);
//xác thực password người dùng với password được lưu trên database
userShema.methods = {
  authenticate: async function (password) {
    return await bcrypt.compare(password, this.hash_password);
  },
};
//tạo model ứng với collection
module.exports = mongoose.model('User', userShema);
