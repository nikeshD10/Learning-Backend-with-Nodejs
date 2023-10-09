// For module imports
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

// For controllers
const errorController = require("./controllers/error");

// For routes
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

// For database
const sequelize = require("./util/database");
const Product = require("./models/product");
const User = require("./models/user");

// create an express app instance
const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// we are adding a new middleware to store the user in the incoming request
// we are adding a new property to the request object
// Note : during npm start only sequelize commmand below runs first. All this middleware are registered only
//        but not executed. They are executed only when we get a incoming request.

// We are guaranted that we have a user in the database because we are creating a user in the sequelize.sync() method below
app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      // we are storing the sequelized user object in the request object not just js object.
      // it has all the sequelize methods and field values like createProduct, getProducts etc.
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404);

// define relationships between models
// constraints: true, onDelete: "CASCADE" means that if we delete a user then all the products associated with that user will also be deleted
Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });

// look at all the models we defined and create tables for them in the database
// it sync modal to database by creating apporpriate tables for them
// it doesn't override the existing tables
sequelize
  .sync({ force: true })
  .then((result) => {
    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      return User.create({ name: "Max", email: "test@test.com" });
    }
    return user;
  })
  .then((user) => {
    // console.log(user);
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
