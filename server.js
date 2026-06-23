require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));

// MongoDB Connection
mongoose.connect("mongodb+srv://urbanculture:safwan123@cluster0.aqirf6e.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
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
            message: "Product Added"
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

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 URBAN Culture Backend Running On Port ${PORT}`);
});
// ==========================
// ORDER SCHEMA
// ==========================

const OrderSchema = new mongoose.Schema({
    customerName: String,
    phone: String,
    address: String,
    items: Array,
    total: Number,
    status: {
        type: String,
        default: "Pending"
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Order = mongoose.model("Order", OrderSchema);

// ==========================
// EDIT PRODUCT
// ==========================

app.put("/products/:id", async (req, res) => {
    try {

        const product =
        await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(product);

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }
});

// ==========================
// GET SINGLE PRODUCT
// ==========================

app.get("/products/:id", async (req, res) => {

    try {

        const product =
        await Product.findById(req.params.id);

        res.json(product);

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

});

// ==========================
// CREATE ORDER
// ==========================

app.post("/orders", async (req, res) => {

    try {

        const order =
        new Order(req.body);

        await order.save();

        res.json({
            success: true,
            message: "Order Placed"
        });

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

});

// ==========================
// GET ALL ORDERS
// ==========================

app.get("/orders", async (req, res) => {

    try {

        const orders =
        await Order.find()
        .sort({ date: -1 });

        res.json(orders);

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

});

// ==========================
// UPDATE ORDER STATUS
// ==========================

app.put("/orders/:id", async (req, res) => {

    try {

        const order =
        await Order.findByIdAndUpdate(
            req.params.id,
            {
                status: req.body.status
            },
            { new: true }
        );

        res.json(order);

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

});

// ==========================
// DASHBOARD STATS
// ==========================

app.get("/dashboard", async (req, res) => {

    try {

        const totalProducts =
        await Product.countDocuments();

        const totalOrders =
        await Order.countDocuments();

        const orders =
        await Order.find();

        let revenue = 0;

        orders.forEach(order => {
            revenue += Number(order.total || 0);
        });

        res.json({
            totalProducts,
            totalOrders,
            revenue
        });

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

});
// ==========================
// CUSTOMER SCHEMA
// ==========================

const CustomerSchema = new mongoose.Schema({

    name: String,
    phone: String,
    email: String,
    address: String,

    joined: {
        type: Date,
        default: Date.now
    }

});

const Customer =
mongoose.model("Customer", CustomerSchema);

// ==========================
// EXPENSE SCHEMA
// ==========================

const ExpenseSchema = new mongoose.Schema({

    title: String,
    amount: Number,

    date: {
        type: Date,
        default: Date.now
    }

});

const Expense =
mongoose.model("Expense", ExpenseSchema);

// ==========================
// ADD CUSTOMER
// ==========================

app.post("/customers", async (req,res)=>{

    try{

        const customer =
        new Customer(req.body);

        await customer.save();

        res.json({
            success:true
        });

    }catch(err){

        res.status(500).json({
            error:err.message
        });

    }

});

// ==========================
// GET CUSTOMERS
// ==========================

app.get("/customers", async(req,res)=>{

    try{

        const customers =
        await Customer.find()
        .sort({joined:-1});

        res.json(customers);

    }catch(err){

        res.status(500).json({
            error:err.message
        });

    }

});

// ==========================
// ADD EXPENSE
// ==========================

app.post("/expenses", async(req,res)=>{

    try{

        const expense =
        new Expense(req.body);

        await expense.save();

        res.json({
            success:true
        });

    }catch(err){

        res.status(500).json({
            error:err.message
        });

    }

});

// ==========================
// GET EXPENSES
// ==========================

app.get("/expenses", async(req,res)=>{

    try{

        const expenses =
        await Expense.find()
        .sort({date:-1});

        res.json(expenses);

    }catch(err){

        res.status(500).json({
            error:err.message
        });

    }

});

// ==========================
// PROFIT / LOSS
// ==========================

app.get("/profit", async(req,res)=>{

    try{

        const orders =
        await Order.find();

        const expenses =
        await Expense.find();

        let revenue = 0;
        let expenseTotal = 0;

        orders.forEach(order=>{
            revenue += Number(order.total || 0);
        });

        expenses.forEach(exp=>{
            expenseTotal += Number(exp.amount || 0);
        });

        res.json({

            revenue,
            expenses:expenseTotal,
            profit:
            revenue - expenseTotal

        });

    }catch(err){

        res.status(500).json({
            error:err.message
        });

    }

});

// ==========================
// LOW STOCK ALERT
// ==========================

app.get("/low-stock", async(req,res)=>{

    try{

        const products =
        await Product.find({
            stock:{ $lte:5 }
        });

        res.json(products);

    }catch(err){

        res.status(500).json({
            error:err.message
        });

    }

});

// ==========================
// MONTHLY SALES
// ==========================

app.get("/monthly-sales", async(req,res)=>{

    try{

        const orders =
        await Order.find();

        const months =
        Array(12).fill(0);

        orders.forEach(order=>{

            const month =
            new Date(order.date)
            .getMonth();

            months[month] +=
            Number(order.total || 0);

        });

        res.json(months);

    }catch(err){

        res.status(500).json({
            error:err.message
        });

    }

});
