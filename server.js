const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

const ProductSchema = new mongoose.Schema({
  name:String,
  price:Number,
  stock:Number,
  category:String,
  featured:String,
  image:String,
  images:[String],
  description:String
});

const Product = mongoose.model("Product", ProductSchema);

app.get("/", (req,res)=>{
  res.send("URBAN Culture Backend Running");
});

app.get("/products", async(req,res)=>{
  try{
    const products = await Product.find().sort({_id:-1});
    res.json(products);
  }catch(err){
    res.status(500).json({error:err.message});
  }
});

app.post("/products", async(req,res)=>{
  try{
    const product = await Product.create(req.body);

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
// =====================
// EDIT PRODUCT
// =====================

app.put("/products/:id", async (req,res)=>{

try{

const product = await Product.findByIdAndUpdate(
req.params.id,
req.body,
{new:true}
);

if(!product){
return res.status(404).json({
success:false,
message:"Product Not Found"
});
}

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

// =====================
// DELETE PRODUCT
// =====================

app.delete("/products/:id", async (req,res)=>{

try{

const product =
await Product.findByIdAndDelete(
req.params.id
);

if(!product){
return res.status(404).json({
success:false,
message:"Product Not Found"
});
}

res.json({
success:true,
message:"Product Deleted"
});

}catch(err){

res.status(500).json({
success:false,
error:err.message
});

}

});

// =====================
// ORDER SCHEMA
// =====================

const OrderSchema =
new mongoose.Schema({

orderId:String,

customerName:String,

phone:String,

address:String,

status:{
type:String,
default:"Order Placed"
},

items:Array,

total:Number,

createdAt:{
type:Date,
default:Date.now
}

});

const Order =
mongoose.model(
"Order",
OrderSchema
);

// =====================
// GET ORDERS
// =====================

app.get("/orders",
async(req,res)=>{

try{

const orders =
await Order.find()
.sort({createdAt:-1});

res.json(orders);

}catch(err){

res.status(500).json({
error:err.message
});

}

});
// =====================
// CREATE ORDER
// =====================

app.post("/orders", async (req,res)=>{

try{

const order = await Order.create({

orderId:
"UC" + Date.now(),

customerName:
req.body.customerName,

phone:
req.body.phone,

address:
req.body.address,

items:
req.body.items || [],

total:
req.body.total || 0

});

res.json({
success:true,
order
});

}catch(err){

res.status(500).json({
success:false,
error:err.message
});

}

});

// =====================
// UPDATE ORDER STATUS
// =====================

app.put("/orders/:id",
async(req,res)=>{

try{

const order =
await Order.findByIdAndUpdate(

req.params.id,

{
status:req.body.status
},

{
new:true
}

);

if(!order){

return res.status(404).json({

success:false,

message:
"Order Not Found"

});

}

res.json({

success:true,

order

});

}catch(err){

res.status(500).json({

success:false,

error:err.message

});

}

});

// =====================
// DELETE ORDER
// =====================

app.delete("/orders/:id",
async(req,res)=>{

try{

const order =
await Order.findByIdAndDelete(
req.params.id
);

if(!order){

return res.status(404).json({

success:false,

message:
"Order Not Found"

});

}

res.json({

success:true,

message:
"Order Deleted"

});

}catch(err){

res.status(500).json({

success:false,

error:err.message

});

}

});

// =====================
// SERVER START
// =====================

const PORT =
process.env.PORT || 5000;

app.listen(PORT,()=>{

console.log(
`🚀 URBAN Culture Backend Running On Port ${PORT}`
);

});
