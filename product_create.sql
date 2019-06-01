create database bamazon;
use bamazon;
CREATE TABLE products(item_id int not null AUTO_INCREMENT,
product_name varchar(80) NULL,
department_name varchar(50) NULL,
department_id int,
price NUMERIC(8,2),
stock_quantity int,
PRIMARY KEY (item_id));

