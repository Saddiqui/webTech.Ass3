// ###############################################################################
// Web Technology at VU University Amsterdam
// Assignment 3
//
// The assignment description is available on Canvas.
// Please read it carefully before you proceed.
//
// This is a template for you to quickly get started with Assignment 3.
// Read through the code and try to understand it.

// ###############################################################################
//
// Database setup:
// First: Our code will open a sqlite database file for you, and create one if it not exists already.
// We are going to use the variable "db' to communicate to the database:
// If you want to start with a clean sheet, delete the file 'products.db'.
// It will be automatically re-created and filled with one example item.

const sqlite = require('sqlite3').verbose();
let db = my_database('./products.db');

// ###############################################################################
// The database should be OK by now. Let's setup the Web server so we can start
// defining routes.
//
// First, create an express application `app`:

var express = require("express");
var app = express();
var bodyParser = require("body-parser");

// We need some middleware to parse JSON data in the body of our HTTP requests:
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// ###############################################################################
// Routes
// ###############################################################################
function my_database(filename) {
	// Conncect to db by opening filename, create filename if it does not exist:
	var db = new sqlite.Database(filename, (err) => {
  		if (err) {
			console.error(err.message);
  		}
  		console.log('Connected to the products database.');
	});
	// Create our products table if it does not exist already:
	db.serialize(() => {
		db.run(`
        	CREATE TABLE IF NOT EXISTS products
        	(id 	  INTEGER PRIMARY KEY,
        	product	CHAR(100) NOT NULL,
        	origin 	CHAR(100) NOT NULL,
        	best_before_date 	CHAR(20) NOT NULL,
          amount  CHAR(20) NOT NULL,
        	image   CHAR(254) NOT NULL
        	)`);
		db.all(`select count(*) as count from products`, function(err, result) {
			if (result[0].count == 0) {
				db.run(`INSERT INTO products (product, origin, best_before_date, amount, image) VALUES (?, ?, ?, ?, ?)`,
				["Apples", "The Netherlands", "November 2019", "100kg", "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Apples.jpg/512px-Apples.jpg"]);
				console.log('Inserted dummy Apples entry into empty product database');
			} else {
				console.log("Database already contains", result[0].count, " item(s) at startup.");
			}
		});
	});
	return db;
}


	// database and return it as JSON object.
app.get("/products", function(req, res) {
	// Example SQL statement to select the name of all products from a specific brand
	// TODO: add code that checks for errors so you know what went wrong if anything went wrong
    // TODO: set the appropriate HTTP response headers and HTTP response codes here.
    db.all("SELECT * FROM products", function(err, rows) {

		    if (err) {
                res.status(400).json({ "error": res.message })
                return;
            }
            res.status(200).json()
    	// # Return db response as JSON
    	return res.json(rows)
    });
});

//Now the server is up and running and the table is ready with some sample database.
//We query the table to get a particular product based on the product_id using get.
app.get("/products/:id", (req, res, next) => {
	db.get(`SELECT * FROM products WHERE id = ?`, [req.params.id], (err, row) => {
		if (err) {
			res.status(400).json({"error":err.message});
			return;
		}
		res.status(200).json(row);
	});
});

//INSERT new products using post
app.post("/products/", (req, res, next) => {
	var reqBody = req.body;
	db.run(`INSERT INTO products (product, origin, best_before_date, amount, image) VALUES (?, ?, ?, ?, ?)`,
		[reqBody.product, reqBody.origin, reqBody.best_before_date, reqBody.amount, reqBody.image],
		(err, result) => {
			if (err) {
				res.status(400).json({ "error": err.message })
				return;
			}
			res.status(201).json({
				"product_id": this.lastID
			})
		});
});

//UPDATE products
app.put("/products/:id", (req, res, next) => {
	db.run(
		`UPDATE products SET
		product = ?, 
		origin = ?, 
		best_before_date = ?,
		amount = ?,
		image = ?
		WHERE id = ?`,
		[req.body.product, req.body.origin, req.body.best_before_date, req.body.amount, req.body.image, req.params.id],
		(err, result) => {
			if (err) {
                res.status(400).json({ "error": res.message })
                return;
            }
            res.status(200).json({ "product_id": req.params.id });
		});
});

//DELETE from products
app.delete("/products/:id", (req, res, next) => {
	db.run(`DELETE FROM products WHERE id = ?`,
        req.params.id,
        function (err, result) {
            if (err) {
                res.status(400).json({ "error": res.message })
                return;
            }
            res.status(200).json({ deleted_id: req.params.id })
        });
});

// ###############################################################################
// This should start the server, after the routes have been defined, at port 3000:

app.listen(3000);


