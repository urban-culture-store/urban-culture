const express = require("express");
const cors = require("cors");
const fs = require("fs");
const mongoose = require("mongoose");

mongoose.connect(
"mongodb+srv://urbanculture:safarudheen@cluster0.aqirf6e.mongodb.net/urbanculture?retryWrites=true&w=majority"
)
.then(()=>{
console.log("✅ MongoDB Connected");
})
.catch(err=>{
console.log(err);
});

const ProductSchema = new mongoose.Schema({
name:String,
price:Number,
stock:Number,
category:String,
featured:String,
image:String,
images:Array,
description:String
});

const Product = mongoose.model(
"Product",
ProductSchema
);

const app = express();

app.use(cors());
app.use(express.json());

const PRODUCTS_FILE = "products.json";
const ORDERS_FILE = "orders.json";

let products = [];
let orders = [];

// Load Products
if(fs.existsSync(PRODUCTS_FILE)){
products = JSON.parse(
fs.readFileSync(PRODUCTS_FILE)
);
}

// Load Orders
if(fs.existsSync(ORDERS_FILE)){
orders = JSON.parse(
fs.readFileSync(ORDERS_FILE)
);
}

// Home
app.get("/",(req,res)=>{
res.send("URBAN Culture Backend Running 🚀");
});

/* =========================
PRODUCTS
========================= */

// Get Products
app.get("/products",async(req,res)=>{

try{

const products =
await Product.find();

res.json(products);

}catch(err){

res.status(500).json({
error:err.message
});

}

});

// Add Product
app.post("/products",async(req,res)=>{

try{

const product =
await Product.create(req.body);

res.json({
success:true,
product
});

}catch(err){

res.status(500).json({
success:false,
error:err.message
});

}

});

// Edit Product
app.put("/products/:id",(req,res)=>{

const id = parseInt(req.params.id);

if(id >= 0 && id < products.length){

products[id] = {
...products[id],
...req.body
};

fs.writeFileSync(
PRODUCTS_FILE,
JSON.stringify(products,null,2)
);

res.json({
success:true,
message:"Product Updated"
});

}else{

res.status(404).json({
success:false,
message:"Product Not Found"
});

}

});


// Delete Product
app.delete("/products/:id",(req,res)=>{

const id = parseInt(req.params.id);

if(id >= 0 && id < products.length){

products.splice(id,1);

fs.writeFileSync(
PRODUCTS_FILE,
JSON.stringify(products,null,2)
);

res.json({
success:true,
message:"Product Deleted"
});

}else{

res.status(404).json({
success:false,
message:"Product Not Found"
});

}

});

/* =========================
ORDERS
========================= */

// Get Orders
app.get("/orders",(req,res)=>{
res.json(orders);
});

// Add Order
app.post("/orders",(req,res)=>{

const order = req.body;

order.orderId = "UC" + Date.now();

order.status = "Order Placed";

order.deliveryPartner = "Not Assigned";

order.trackingId = "TRK" + Date.now();

order.tracking = [
{
status:"Order Placed",
date:new Date().toLocaleString()
}
];

orders.push(order);

fs.writeFileSync(
ORDERS_FILE,
JSON.stringify(orders,null,2)
);

res.json({
success:true,
message:"Order Saved"
});

});

// Update Order Status
app.put("/orders/:id",(req,res)=>{

const id = parseInt(req.params.id);

if(id >= 0 && id < orders.length){

orders[id].status =
req.body.status;

fs.writeFileSync(
ORDERS_FILE,
JSON.stringify(orders,null,2)
);

res.json({
success:true,
message:"Status Updated"
});

}else{

res.status(404).json({
success:false,
message:"Order Not Found"
});

}

});

// Delete Order
app.delete("/orders/:id",(req,res)=>{

const id = parseInt(req.params.id);

if(id >= 0 && id < orders.length){

orders.splice(id,1);

fs.writeFileSync(
ORDERS_FILE,
JSON.stringify(orders,null,2)
);

res.json({
success:true,
message:"Order Deleted"
});

}else{

res.status(404).json({
success:false,
message:"Order Not Found"
});

}

});

/* =========================
SERVER
========================= */

app.listen(5000,()=>{

console.log(
"🚀 URBAN Culture Backend Running On Port 5000"
);

});
