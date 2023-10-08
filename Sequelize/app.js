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

const sequelize = require("./util/database");

// create an express app instance
const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404);

// look at all the models we defined and create tables for them in the database
// it sync modal to database by creating apporpriate tables for them
// it doesn't override the existing tables
sequelize
  .sync()
  .then((result) => {
    // console.log(result);
    app.listen(3000);
  })
  .catch((err) => {
    // console.log(err);
  });
