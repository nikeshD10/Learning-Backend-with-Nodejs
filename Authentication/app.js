const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash"); // For showing flash messages
require("dotenv").config();

const errorController = require("./controllers/error");
const User = require("./models/user");

const MONGODB_URI = process.env.MONGODB_URI;
const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

// Initializing csrf protection
// Default settings includes cookie: {httpOnly: true, secure: true}
// But we are not using https so we are not using secure: true
// We are using httpOnly: true so that the cookie cannot be accessed by javascript
// We are using sameSite: true so that the cookie cannot be accessed by cross-site requests
// We are using maxAge: 3600 so that the cookie expires after 1 hour

const csrfProtection = csrf(); // csrfProtection is a middleware

// For registering flash middleware
app.use(flash());

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
// csrfProtection should be used after session middleware
app.use(csrfProtection);

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

// For every request executed this two fields will be added to the response object
// This middleware will run for every request
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    // creating a dummy user
    // User.findOne().then((user) => {
    //   if (!user) {
    //     const user = new User({
    //       name: "Aryan",
    //       email: "aryan@test.com",
    //       cart: {
    //         items: [],
    //       },
    //     });
    //     user.save();
    //   }
    // });
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
