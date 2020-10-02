const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userShema = new mongoose.Schema(
  {
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
    hash_password: {
      type: String,
      require: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      defautl: "admin",
    },
  },
  { timestamps: true }
);
userShema.virtual("password").set(function (password) {
  this.hash_password = bcrypt.hashSync(password, 10);
});
userShema.methods = {
  authenticate: function (password) {
    return bcrypt.compareSync(password, this.hash_password);
  },
};
module.exports = mongoose.model("User", userShema);
