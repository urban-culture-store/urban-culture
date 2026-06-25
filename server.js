require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors({
  origin: [
    "https://urban-culture-store.netlify.app",
    "http://localhost:5500",
    "http://127.0.0.1:5500"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json({ limit: "50mb" }));

// Product Schema

// ==========================================
// DATABASE CONNECTION
// ==========================================

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// ==========================================
// SCHEMAS & MODELS
// ==========================================

// 1. Product Schema
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

// 2. User Schema
const UserSchema = new mongoose.Schema({
  name: String,
  phone: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
const User = mongoose.model("User", UserSchema);

// 3. Order Schema
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

// ==========================================
// ROUTES / API ENDPOINTS
// ==========================================

// Base Route
app.get("/", (req, res) => {
  res.send("🚀 URBAN Culture Backend Running");
});

// --- PRODUCT ROUTES ---

// Get All Products
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find().sort({ _id: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add Product
app.post("/products", async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.json({
      success: true,
      message: "Product Added Successfully",
      product
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
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
      message: "Product Updated Successfully",
      product: updated
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Product
app.delete("/products/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({
      success: true,
      message: "Product Deleted Successfully"
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- AUTH / USER ROUTES ---

// Register User
app.post("/register", async (req, res) => {
  try {
    const { name, phone, password } = req.body;

    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ message: "Account Already Exists" });
    }

    const user = new User({ name, phone, password });
    await user.save();

    res.json({
      success: true,
      message: "Account Created Successfully"
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login User
app.post("/login", async (req, res) => {
  try {
    const { phone, password } = req.body;

    const user = await User.findOne({ phone, password });
    if (!user) {
      return res.status(401).json({ message: "Invalid Login Credentials" });
    }

    res.json({
      success: true,
      user
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- ORDER ROUTES ---

// Place Order
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
    res.status(500).json({ error: err.message });
  }
});

// Get All Orders
app.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Single Order
app.get("/orders/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order Not Found" });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Order Status
app.put("/orders/:id", async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Single Order
app.delete("/orders/:id", async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({
      success: true,
      message: "Order Deleted Successfully"
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Clear All Orders (Danger Zone)
app.delete("/clear-orders", async (req, res) => {
  try {
    await Order.deleteMany({});
    res.json({
      success: true,
      message: "All Orders Deleted Successfully"
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// START SERVER
// ==========================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server Running On Port ${PORT}`);
});
