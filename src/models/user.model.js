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
userShema.methods = {
  authenticate: async function (password) {
    return await bcrypt.compare(password, this.hash_password);
  },
};
module.exports = mongoose.model("User", userShema);
