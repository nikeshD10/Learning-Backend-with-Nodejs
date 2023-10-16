const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");
// Multer is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files.
// Multer is another third party package parses incoming requests for files,
/*
  so it is able to handle file requests as well or requests with mixed data, with text and file data.
  We'll still keep body parser because we still have like for example, our sign up form where we only submit
  url encoded data but now we'll have to use a different encoding and that starts with our form.
*/
const multer = require("multer");
require("dotenv").config();

const errorController = require("./controllers/error");
const User = require("./models/user");

const MONGODB_URI = process.env.MONGODB_URI;
const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});
const csrfProtection = csrf();

/*

----------------------------------  Note:  ----------------------------------
Perhaps someone may be getting error isLoggedIn undefined error. 
That error is occurring because new Date().toISOString() bypasses the session middleware 
to central error middleware where our session middleware can't set request object fully.
And whenever we do submit of content-type: multipart/form-data then on submission the session
get's reset somehow. So isLoggedIn data is lost that's why we get undefined.
Simple solution to this problem will be just remove new Date().toISOString() part and other string concatenation part because that is main reason to cause this error.
filename: (req, file, cb) => {
    cb(   null,   file.originalname.replace(/ /g, "_")
  ); 
},

Just like this your error will be solved.

--------------------------------------  Solved    --------------------------------------
*/

// Hre we're telling multer where to store the incoming files.
// We're storing them in a folder called images.
// We're also telling multer how to name the incoming files.
// We're naming them with a timestamp and the original file name.
// We can now control path and file name.

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // it is a function that will be executed for every incoming file.
    // it receives the request object, the file, and a callback function.
    // cb(null, "images"); // the callback function expects an error and a destination.
    cb(null, "images"); // the callback function expects an error and a destination.
  },
  filename: (req, file, cb) => {
    // it is a function that will be executed for every incoming file.
    cb(null, file.originalname.replace(/ /g, "_")); // the callback function expects an error and a file name.
    // And we're naming the file with a timestamp and the original file name. We're using toISOString() to get a valid date string.
  },
});

// it is a function that will be executed for every incoming file.
// it receives the request object, the file, and a callback function.
// This function filters the incoming files
const fileFilter = (req, file, cb) => {
  // Here we're checking if the incoming file is an image or not.
  // We're checking the file's mime type.
  // We're checking if the file's mime type is equal to image/png or image/jpg or image/jpeg.
  // If it is, we accepts the file.
  // If it is not, we rejects the file.
  const allowedMimeTypes = ["image/png", "image/jpeg", "image/jpg"];

  if (allowedMimeTypes.includes(file.mimetype)) {
    // if we accepts file we call the callback function with true.
    cb(null, true); // the callback function expects an error and a boolean value.
  } else {
    // if we rejects file we call the callback function with false.
    cb(null, false); // the callback function expects an error and a boolean value.
  }
};

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

app.use(bodyParser.urlencoded({ extended: false }));
// we need to call multer as a function and pass a configuration object to it.
// Configuration object is where we tell multer where to store the incoming files.
// We can also configure the file name.
// The method single() tells multer that we're expecting a single file with the name image.
// app.use(
//   multer({
//     dest: "images",
//   }).single("image")
// );

app.use(
  multer({
    storage: fileStorage,
    fileFilter: fileFilter,
  }).single("image")
); // single takes the name of the field where we're expecting the file.

app.use(express.static(path.join(__dirname, "public")));
// app.use("/images", express.static(path.join(dirname, "images")));

app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

// csrfProtection must be registered after the session middleware and before the routes.
app.use(csrfProtection);

// We need to register the flash middleware after the session middleware.
app.use(flash());

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use((req, res, next) => {
  // throw new Error('Sync Dummy');
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      next(new Error(err));
    });
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get("/500", errorController.get500);

app.use(errorController.get404);

app.use((error, req, res, next) => {
  // res.status(error.httpStatusCode).render(...);
  // res.redirect('/500');
  res.status(500).render("500", {
    pageTitle: "Error!",
    path: "/500",
    isAuthenticated: req.session.isLoggedIn,
  });
  // console.log("Error is being called : " + error);
  // return res.status(500).json({ message: error.message });
});

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
