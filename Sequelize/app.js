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

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404);

app.listen(3000);
