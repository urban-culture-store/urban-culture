require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.log(err));

// Product Schema
const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
  stock: Number,
  category: String,
  featured: String,
  image: String,
  images: [String],
  description: String
});

const Product = mongoose.model("Product", ProductSchema);

// Home Route
app.get("/", (req, res) => {
  res.send("🚀 URBAN Culture Backend Running");
});

// Get All Products
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find().sort({ _id: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

// Add Product
app.post("/products", async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();

    res.json({
      success: true,
      message: "Product Added",
      product
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});
// Update Product
app.put("/products/:id", async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      success: true,
      message: "Product Updated",
      product: updated
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

// Delete Product
app.delete("/products/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Product Deleted"
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

// ======================
// ORDER SCHEMA
// ======================

const OrderSchema = new mongoose.Schema({
  customerName: String,
  phone: String,
  address: String,
  district: String,
  pincode: String,

  items: Array,

  total: Number,

  status: {
    type: String,
    default: "Pending"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Order = mongoose.model("Order", OrderSchema);

// ======================
// PLACE ORDER
// ======================

app.post("/orders", async (req, res) => {
  try {

    const order = new Order(req.body);

    await order.save();

    res.json({
      success: true,
      message: "Order Placed Successfully",
      order
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

// ======================
// GET ALL ORDERS
// ======================

app.get("/orders", async (req, res) => {
  try {

    const orders = await Order.find()
      .sort({ createdAt: -1 });

    res.json(orders);

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

// ======================
// UPDATE ORDER STATUS
// ======================

app.put("/orders/:id", async (req, res) => {
  try {

    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

// ======================
// DELETE ORDER
// ======================

app.delete("/orders/:id", async (req, res) => {
  try {

    await Order.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Order Deleted"
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

// ======================
// START SERVER
// ======================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server Running On Port ${PORT}`);
});
