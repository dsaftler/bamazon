// cSpell:enable
// cSpell:words bamazon

const inquirer = require("inquirer");
// const mysql = require("mysql");
var connection;
const config = require('./config.js')
var cart = 0, extPrice = 0
var Table = require("cli-table-redemption");
var curItems = [];
showProductsTable();

function displayProducts() {
  // 3;
  inquirer.prompt([{ 
    name : "item_id" ,
    message: "Item # you want to buy: ",
    validate: function (value){
      isValid = curItems.indexOf(parseInt(value)) != -1;
      if (!isValid) { console.log('    Not a Valid Item #') }
      return isValid} 
    },
    { name: "qty",
    message: "How many ?",
    validate: function(value){
     isValid = isNaN(value)===false && value>0
     if (!isValid) { console.log('    Not a Valid Quantity') }
     return isValid }
    }])
  .then ( function (data) {
    // console.log("data item 32: " +data.item_id);
    var thisItem = parseInt(data.item_id);
    var thisQty=parseInt(data.qty)
    var query = "SELECT stock_quantity,price FROM products WHERE ?";
    try {
      // connection = config.dbConnect();
      connection.query(query, { item_id: thisItem }, function(err,result,fields){
      // console.log(result);
      var curOnHand = result[0].stock_quantity;
      var itemPrice = result[0].price;
      // console.log(curOnHand);
      if (err) throw err;

        if (curOnHand >= thisQty) {
        var newQty = curOnHand - thisQty
        // console.log(newQty);
        var qry = "UPDATE products SET ? WHERE ?";
        try {
          // connection = config.dbConnect();
          // qry = "UPDATE products SET `stock_quantity` = 484 WHERE `item_id` = '3'";
          // connection.query(qry, function (err, res) {
          connection.query(qry, [{ stock_quantity: newQty },{ item_id: data.item_id }], function (err, res) {
            // "UPDATE products SET `stock_quantity` = 484 WHERE `item_id` = '3'"
          if (err) throw err;
          // console.log("Updated Inventory: " + res.affectedRows);
          console.log("message: " + res.message+'/n');
            extPrice = parseFloat(itemPrice * data.qty).toFixed(2)
            console.log("Extended Price: $ " + extPrice)
            console.log(cart);
            cart = cart + extPrice;
          console.log("In your Cart:   $ "+ cart+'\n')
            // console.log(res.affectedRows + " products updated!\n");
          });
          // connection.end();
        } catch (err) {
            console.log(err);
        }
      } else {
        console.log("There aren't enough in stock\n");
      };
      // connection.end();
    });
  }catch (err) {
    console.log(err);
  };
  showProductsTable()
  });
};

function showProductsTable() {
  try {
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
      valRA.push(res[i].product_name)
      valRA.push(res[i].department_name)
      valRA.push(res[i].price)
      valRA.push(res[i].stock_quantity)
      table.push(valRA);
      curItems.push(res[i].item_id);
    }     
    console.clear();
    console.log(table.toString())

    displayProducts();
   });
  }catch (err) {
    console.log(err);
  }
};