<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>My Orders</title>

<style>

*{
margin:0;
padding:0;
box-sizing:border-box;
font-family:-apple-system,BlinkMacSystemFont,sans-serif;
}

body{
background:#000;
color:white;
padding:20px;
}

.container{
max-width:1000px;
margin:auto;
}

h1{
text-align:center;
margin-bottom:25px;
}

.order{
background:#111;
border:1px solid #222;
border-radius:20px;
padding:20px;
margin-bottom:15px;
cursor:pointer;
transition:.3s;
}

.order:hover{
transform:translateY(-3px);
border-color:#444;
}

.name{
font-size:20px;
font-weight:bold;
margin-bottom:10px;
}

.price{
font-size:22px;
font-weight:bold;
color:#00ff88;
margin-top:10px;
}

.status{
display:inline-block;
padding:8px 15px;
border-radius:10px;
margin-top:10px;
background:#222;
}

.date{
color:#aaa;
margin-top:8px;
}

.empty{
text-align:center;
padding:50px;
color:#999;
}

</style>
</head>

<body>

<div class="container">

<h1>📦 My Orders</h1>

<div id="orders"></div>

</div>

<script>

async function loadOrders(){

const customer =
JSON.parse(
localStorage.getItem("customer")
);

if(!customer){

window.location.href =
"customer-login.html";

return;

}

const res =
await fetch(
"https://urban-culture.onrender.com/orders"
);

const allOrders =
await res.json();

const orders =
allOrders.filter(order=>

order.phone === customer.phone

);

let html="";

if(orders.length===0){

html = `
<div class="empty">
No Orders Found
</div>
`;

}else{

orders.reverse().forEach(order=>{

html += `

<div
class="order"
onclick='openOrder(${JSON.stringify(order)})'>

<div class="name">
${order.items?.[0]?.name || "Product"}
</div>

<div class="price">
₹${order.total || 0}
</div>

<div class="date">
📅 ${order.date || ""}
</div>

<div class="date">
🆔 ${order.orderId || ""}
</div>

<div class="status">
${order.status || "Pending"}
</div>

</div>

`;

});

}

document.getElementById("orders")
.innerHTML = html;

}

function openOrder(order){

localStorage.setItem(
"selectedOrder",
JSON.stringify(order)
);

window.location.href =
"order-details.html";

}

loadOrders();

</script>

</body>
</html>
