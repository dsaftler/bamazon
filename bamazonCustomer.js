// cSpell:enable
// cSpell:words bamazon
// const mysql = require("mysql");
var Table = require("cli-table-redemption");
const inquirer = require("inquirer")
var ui = new inquirer.ui.BottomBar();
var connection;
const config = require('./config.js')
var cart = 0, extPrice = 0
var curItems = [];

showProductsTable();

function displayProducts() {
  // 3;
  ui.log.write("Enter 0 for an Item # to exit...")
  inquirer.prompt([{ 
    name : "item_id" ,
    input: { type: 'number' },
    message: "Item # you want to buy: ",
    validate: function (value){
      isValid = value==="0" || curItems.indexOf(parseInt(value)) != -1;
      if (value ==="0")
        {connection.end();
        ui.log.write("\u001B[36m"+"Goodbye & thanks for shopping with Bamazon");
        process.exit();}
      if (!isValid) { console.log("\u001b[1;31m" +'    Not a Valid Item #') }
      return isValid} 
    },
    { name: "qty",
     input: {type: 'number'},
     message: "How many ?",
     validate: function(value){
     isValid = isNaN(value)===false && parseInt(value)>0
       if (!isValid) { console.log("\u001b[1;31m" +'    Not a Valid Quantity') }
     return isValid }
    }])
  .then ( function (data) {
    ui.log.write("\u001b[1;33m" +"--------------------   Checking Available Stock   ----------------------");
    var thisItem = parseInt(data.item_id);
    var thisQty=parseInt(data.qty);
    var query1 = "SELECT stock_quantity,price FROM products WHERE ?"

    connection.query(query1, { item_id: thisItem }, function(err,result,fields){
     // console.log(result);
    var curOnHand = result[0].stock_quantity;
    var itemPrice = result[0].price;
      // console.log(curOnHand);
    if (err) throw err;
    if (curOnHand >= thisQty) {
      var newQty = curOnHand - thisQty
      // console.log(newQty);
      var qry = "UPDATE products SET ? WHERE ?";
        // connection = config.dbConnect();
        // qry = "UPDATE products SET `stock_quantity` = 484 WHERE `item_id` = '3'";
        // connection.query(qry, function (err, res) {
      connection.query(qry, [{ stock_quantity: newQty }, { item_id: thisItem
          }], function (err, res) {
          // "UPDATE products SET `stock_quantity` = 484 WHERE `item_id` = '3'"
      if (err) throw err;
      ui.log.write("\u001b[1;32m"+"Bamazon says: " + res.message);
      extPrice = parseFloat((itemPrice * data.qty).toFixed(2))
      cart = parseFloat(cart.toFixed(2))
      cart += extPrice;
      ui.log.write("\u001b[1;32m"+"Extended Price: $ " + extPrice.toFixed(2) + "      In your Cart:   $ " + cart.toFixed(2));
      showProductsTable();
    });
  } else {
      ui.log.write("\u001b[1;31m"+"There aren't enough in stock right now. Try again tomorrow.");
      ui.log.write("\u001b[1;32m"+"Extended Price: $ " + extPrice.toFixed(2) + "      In your Cart:   $ " + cart.toFixed(2));
      //  process.stdin.setRawMode(true);
      // process.stdin.resume();
      // process.stdin.on('readable', function () {
          // var key = string(process.stdin.read());
      // })
      showProductsTable()
  };
 
});


function showProductsTable() {
  // try {
   connection = config.dbConnect();
  //TODO  select * from products order by department_name where stock_quantity > 0
  connection.query("SELECT item_id,product_name, department_name,price,stock_quantity FROM products WHERE stock_quantity>0  ORDER BY department_name, product_name", function (err, res, fields ) {
    if (err) throw err;
    curItems = [];  // store all the current Item Ids for validation in Inquire
    var table = new Table({
      head: ['Item #', 'Product', 'Department', 'Price','In Stock'],
      colWidths: [10, 90, 35, 12, 12],
      colAligns: ['middle', 'left', 'left', 'right', 'right'],
      style: { head: ['blue'], border: ['grey'] }});
    
    for (let i = 0; i<res.length; i++) {
      var valRA = [];
      valRA.push(res[i].item_id);
      valRA.push(res[i].product_name);
      valRA.push(res[i].department_name);
      valRA.push(res[i].price.toFixed(2));
      valRA.push(res[i].stock_quantity);
      table.push(valRA);
      curItems.push(res[i].item_id);
    }
    // console.clear();
    console.log(table.toString());

    displayProducts();
   })
  // }catch (err) {
  //   console.log(err);
  // }
};