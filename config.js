var mysql = require('mysql');
var connection;
module.exports = {  
  dbConnect: function (){
    connection = mysql.createConnection( 
 {
    host: "localhost",
    PORT: 3306,
    user: "root",
    password: "testPassword",
    database: "bamazon"
  });
  connection.connect(function (err) {
  if (err) throw err;
    console.log("\u001B[0m" +"Connection status: " + connection.state);
  });

return connection;
  }
};
