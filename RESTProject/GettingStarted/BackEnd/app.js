const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();
const path = require("path");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const feedRoutes = require("./routes/feed");

const app = express();

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // cb is callback
    cb(null, "images"); // null is for error
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4()); // null is for error
  },
});

const fileFilter = (req, file, cb) => {
  if (
    // If the file is an image, then store it
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  )
    cb(null, true); // null is for error
  else cb(null, false);
};

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json

// Multer middleware
app.use(multer({ storage: storage, fileFilter: fileFilter }).single("image")); // single() means we are expecting a single file stored in that image field
/*
here we can use path join to construct an absolute path to that images folder.
By using the special dirname variable which is available globally in nodejs 
and gives us access to the directory path to that file, to the app.js file
and in that same location as this app.js file, we find the images folder,
so we can pass images as a second argument and path join will construct an absolute path to this images
folder and that is the folder we'll serve statically for requests going to /images.
*/
app.use("/images", express.static(path.join(__dirname, "images"))); // This will allow us to serve images statically

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/feed", feedRoutes);

// Error handling middleware
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500; // If there is no status code, we will use 500
  const message = error.message;
  res.status(status).json({ message: message });
});

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) => {
    app.listen(8080);
  })
  .catch((err) => console.log(err));
