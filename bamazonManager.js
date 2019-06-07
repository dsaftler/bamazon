var Table = require("cli-table-redemption");
const inquirer = require("inquirer")
var ui = new inquirer.ui.BottomBar();
var connection;
const config = require('./config.js')
var curItems = [];
var curInv = [];

doFunctions();
function doFunctions() {
  inquirer.prompt ([{
    type: "list",
    name: "job",
    message: "Select a function",
    choices: ["View Products for Sale",
              "View Low Inventory",
              "Add to Inventory",
              "Add New Product",
              "Exit"],
    filter: function (val) { return val.toLowerCase(); }
}])
  .then(function (data) {
  var myJob = data.job;
  switch (myJob) {
    case "view products for sale":
      showAll();
    break;
    case "view low inventory":
      showLow();
    break;
    case "add to inventory":
      addInventory();      
    break;
    case "add new product":
      newItem();
    break;
    case "exit":
      connection.end();
      ui.log.write("\u001B[36m" + "Goodbye & thanks for managing Bamazon's (fabulous) Inventory");
      process.exit();
    break;
  }
  });
//doFunctions();
}
function showAll() {
   connection = config.dbConnect();
  // //TODO  select * from products 
  connection.query("SELECT item_id,product_name, department_name,price,stock_quantity FROM products ORDER BY product_name", function (err, res) {
    if (err) throw err;
    showTable(res); 
   });
}
function showLow() {
  connection = config.dbConnect();
  //TODO  select * from products order by department_name where stock_quantity < 5
  connection.query("SELECT item_id,product_name, department_name,price,stock_quantity FROM products WHERE stock_quantity<5 ORDER BY product_name", function (err, res, fields) {
    if (err) throw err;
    showTable(res);
  });
}
function addInventory() {
  curInventory();
  inquirer.prompt ([
    { name: "item_id",
      input: { type: 'number' },
      message: "Item # to replenish: ",
      validate: function (value) {
        isValid  = curInv.indexOf(parseInt(value)) != -1;
        if (!isValid) { console.log("\u001b[1;31m" + '    Not a Valid Item #') }
        return isValid }
    },
    { name: "qty",
      input: { type: 'number' },
      message: "How many to add?",
      validate: function (value) {
        isValid = isNaN(value) === false && parseInt(value) > 0
        if (!isValid) { console.log("\u001b[1;31m" + '    Not a Valid Quantity') }
        return isValid }
    }])
    .then( function (data) {
      var thisItem = parseInt(data.item_id);
      var thisQty = parseInt(data.qty);
      var newQty = 0;
      var qry = "SELECT stock_quantity FROM products WHERE ?"
      connection.query(qry, { item_id: thisItem }, function (err, res) {
        if (err) throw err;
         newQty = res[0].stock_quantity + thisQty;
        showTable(res);
      })
      var qry = "UPDATE products SET ? WHERE ?";
          // connection = config.dbConnect();
          // qry = "UPDATE products SET `stock_quantity` = 484 WHERE `item_id` = '3'";
          // connection.query(qry, function (err, res) {
      connection.query(qry, [{ stock_quantity: newQty }, { item_id: thisItem }], function (err, res) {
            // "UPDATE products SET `stock_quantity` = 484 WHERE `item_id` = '3'"
      if (err) throw err;
      ui.log.write("\u001b[1;32m" + "Bamazon says: " + res.message);
      showTable(res);

      });
      connection.query("SELECT item_id,product_name, department_name,price,stock_quantity FROM products WHERE item_id = thisItem", function (err, res) {
        if (err) throw err;
        showTable(res);
      });
  //TODO  select * from products 
  });
}
function newItem() {
  inquirer.prompt ([
    { name: "product_name",
      input: "text",
      message: "Product Name ?"},
    {name: "department_name",
      input: "text",
      message: "Department ?"
    },
    { name: "price",
      input: "text",
      message: "Price ?",
      validate: function (value) {
        isValid = isNaN(value) === false && parseInt(value) > 0
        if (!isValid) { console.log("\u001b[1;31m" + '    Not a Valid Price') }
        return isValid }
    },
    { name: "stock_quantity",
      input: "text",
      message: "Initial Inventory",
       validate: function (value) {
        isValid = isNaN(value) === false && parseInt(value) >= 0
        if (!isValid) { console.log("\u001b[1;31m" + '    Not a Valid Quantity') }
        return isValid }
    }
  ]) .then(function (data){
    // qry = "INSERT into products SET ?,(product_name, department_name, price, stock_quantity) VALUES (?,?,?,?)"
    var LastID = connection.query("INSERT into products SET ?",
      { product_name: data.product_name,
        department_name:data.department_name,
        price: data.price,
        stock_quantity: data.stock_quantity}, function (err,res) {
        if (err) throw err;
       connection.query("SELECT item_id,product_name, department_name,price,stock_quantity FROM products WHERE item_id = LastID", function (err, res) {
        if (err) throw err;  
        showTable(res);
      });
    })
  })
}

function showTable(res) {
  curItems = [];  // store all the current Item Ids for validation in Inquire
  var table = new Table({
    head: ['Item #', 'Product', 'Department', 'Price', 'In Stock'],
    colWidths: [10, 90, 35, 12, 12],
    colAligns: ['middle', 'left', 'left', 'right', 'right'],
    style: { head: ['blue'], border: ['grey'] }
  });

  for (let i = 0; i < res.length; i++) {
    var valRA = [];
    valRA.push(res[i].item_id);
    valRA.push(res[i].product_name);
    valRA.push(res[i].department_name);
    valRA.push(res[i].price.toFixed(2));
    valRA.push(res[i].stock_quantity);
    table.push(valRA);
    curItems.push(res[i].item_id);
  }
  console.log(table.toString());
  doFunctions();
};
function curInventory() {
  curInv = [];
  connection = config.dbConnect();
    //TODO  select * from products 
    connection.query("SELECT item_id,product_name, department_name,price,stock_quantity FROM products ORDER BY product_name", function (err, res) {
      if (err) throw err;
      for (let i = 0; i < res.length; i++) {
        curInv.push(res[i].item_id);
      }
    });
}