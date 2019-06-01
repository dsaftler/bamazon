// cSpell:enable
// cSpell:words bamazon

const inquirer = require("inquirer");
const mysql = require("mysql");
var Table = require("cli-table");

const connection = mysql.createConnection({
  host: "localhost",
  PORT: 3306,
  user: "root",
  password: "nebo90Sm",
  database: "bamazon"
});
connection.connect( function (err){
  if (err) throw err;
  console.log("connected as id:"+connection.threadId+"\n");
  displayProducts();
})
// select * from products order by department_name where stock_quantity>0
function displayProducts() {
  // 3;
  inquirer.prompt([{ 
    name : "item_id" ,
    message: "enter the item_id: "},
    { name: "qty",
    message: "how many ?",
    validate: function(value){
     return (isNaN(value)===false)}
    }])
  .then ( function (data) {
    console.log("data item 32: " +data.item_id);
    var thisItem = data.item_id;
    var query = "SELECT stock_quantity FROM products WHERE ?";
    connection.query(query, { item_id: thisItem }, function(err,res){
      // console.log(query);
      if (err) throw err;
      console.log("res 37: "+res);
      console.log("data 38: "+data.qty);
      if (res>=data.qty) {
        var newQty = res.stock_quantity - data.qty
        console.log(newQty);
        var query = connection.query(
        "UPDATE products SET ? WHERE ?", 
          [{ item_id: data.item_id }, {stock_quantity: newQty}], function (err, res) {
          console.log("res 43: " + res);
            // console.log(res.affectedRows + " products updated!\n");
          //  displayProducts();
          });
      } else {
        console.log("There aren't enough in stock");
      };
      connection.end();
      });
  });
};

function showProductsTable() {
  //TODO  select * from products order by department_name where stock_quantity > 0
  connection.query("SELECT * FROM products WHERE stock_quantity>0  ORDER BY department_name, product_name", function (err, res) {
    for (var i = 0; i < res.length; i++) {
    console.log(
      "Item_ID: " +
      res[i].item_id +
      " || Description: " +
      res[i].product_name +
      " || Department: " +
      res[i].department_name +
      " || Price: " +
      res[i].price +
      " || In Stock: " +
      res[i].stock_quantity
    );
    };
  });
};
