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
    console.log("connected as id:" + connection.threadId);
  });

return connection;
  }
};
// return {host: "localhost",
// PORT: 3306,
// user: "root",
// password: "testPassword",
// database: "bamazon"}