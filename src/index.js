const express = require("express");
const env = require("dotenv");

const mongoose = require("mongoose");
const userRouters = require("./routes/auth.router");
const adminRoutes = require("./routes/admin/auth.router");
const categoryRoutes = require("./routes/category.router");
const productRouters = require("./routes/product.router");
const initialDataRouters = require("./routes/admin/initialData.router");
const orderRouters = require("./routes/order.router");
const cors = require("cors")
const path = require("path");
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")))
env.config();
mongoose.connect(
  "mongodb://localhost:27017/ecommerce-tlcn",
  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
  (err) => {
    if (err !== null) {
      throw err;
    }
    console.log("Mongo connected");
  }
);
app.use(cors());
app.use("/api", userRouters);
app.use("/api", adminRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRouters);
app.use("/api", initialDataRouters);
app.use("/api", orderRouters);
app.listen(process.env.PORT, () => {
  console.log(`server running ${process.env.PORT}`);
});
