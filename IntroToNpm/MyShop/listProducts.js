var something = require("faker");
for(var i = 0; i < 10; i++){
    console.log(something.commerce.productName() + " - " + something.commerce.price());
}