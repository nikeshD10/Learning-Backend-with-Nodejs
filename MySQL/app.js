// For module imports
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

// For controllers
const errorController = require("./controllers/error");

// For routes
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

// For databse
/*
  This db will basically be a connection pool
*/
const db = require("./util/database");

// create an express app instance
const app = express();

db.execute("SELECT * FROM products")
  .then((result) => {
    // result[0] is the rows i.e data is stored in the result[0]
    // result[1] is the metadata
    console.log(result[0], result[1]);
  })
  .catch((err) => {
    console.log(err);
  });
app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

app.listen(3000);
