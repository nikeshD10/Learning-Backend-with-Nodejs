const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
// session is required when we don't want to lose the data after every response is sent
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session); // This is a constructor function that we can call to create a new store

const errorController = require("./controllers/error");
const User = require("./models/user");

const MONGODB_URI =
  "mongodb+srv://ipbcybe2022:M0ngoDBAryan@project0.lyxhh8a.mongodb.net/shop";
const app = express();
// This is a store that will be used to store our sessions in the database
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions", // This is the collection that will be created in the database
});

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "MySecret",
    resave: false, // This means that the session will not be saved on every request that is done to the server but only if something changed in the session object
    saveUninitialized: false, // This ensures that no session gets saved for a request where it doesn't need to be saved
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1 day
    store: store, // This is the store that will be used to store our sessions in the database
  })
);

// Note: this middleware is executed for every incoming request
// Because this middleware is executed for every incoming request, it's a good place to check if the user is logged in
// This middleware runs in every incoming requests before our routes handles them
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

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          name: "Max",
          email: "max@test.com",
          cart: {
            items: [],
          },
        });
        user.save();
      }
    });
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
