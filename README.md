# bamazon
--- What works:  This is a CLI using node.js with inquirer, mysql, and cli-table-redemption
to model a simple inventory program in the terminal.
•	11 Items have been stored in a mysql database table (created & populated in MySQL by scripts).
•	Items that have inventory are presented to the user ordered by department (showProductsTable()
•	The user is prompted (inquirer) for item # (item_id) and quantity to buy. (displayProducts())
•	Validations:
o	Item # must be an item # from the selected table because only those items have inventory
o	Quantity must be a number, and must be greater than 0
•	If the user enters a quantity greater than the amount of inventory, there is a warning message and the transaction is dropped.
•	Otherwise, a message is shown with the SQL transaction, 
o	the inventory is decremented 
o	the user is shown the extended price and the current total value of all items the cart.
•	If the inventory drops to 0, that row is now longer shown in the table.
•	The user is prompted to enter 0 as the item # to exit the program.
--- What didn’t work:
•	mysql.createPool was not able to connect, so this may be an issue if the server becomes unavailable.  Connection.end() is only called prior to  process.exit().
•	I coded this with {try}{catch} but removed them as they made it more difficult to see the program flow without offering much.
•	I tried a couple of ways (using process.stdin.on & readline) to get the application to wait for a ‘hit any key to continue’ before running the inventory table refresh, but they did not work. 
•	I expected that input {type: “number”} in inquirer would return a number, but it doesn’t – I’m not sure what the point of that syntax is in that case.
•	Formatting numbers as strings and getting strings to be treated as numbers seems much fussier and more complicated than it should be: e.g. parseFloat(cart.toFixed(2))
•	I used cli-table-redemption instead of cli-table3, as that is listed as ‘unstable’.  I’m disheartened that the second choice is only rated as a 72 quality, it hasn’t been worked on in 2 years, and the documentation is very thin. (complain, complain, complain)
--- if time permits
•	Add a Manager View to maintain the inventory and add new items, since most of the routines I built can be modified pretty easily to fit these requirements.




