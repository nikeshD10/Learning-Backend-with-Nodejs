const path = require("path");
const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
require("dotenv").config();
const { graphqlHTTP } = require("express-graphql");
const graphqlSchema = require("./graphql/schema");
const graphqlResolver = require("./graphql/resolvers");
const auth = require("./middleware/auth");
const { v4: uuidv4 } = require("uuid");
const { clearImage } = require("./util/file");

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    const mapImage = {
      "image/png": ".png",
      "image/jpg": ".jpg",
      "image/jpeg": ".jpeg",
    };
    const ext = mapImage[file.mimetype];
    cb(null, uuidv4() + ext);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);
app.use("/images", express.static(path.join(__dirname, "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  /*
    the browser sends an options request before it sends the post, patch, put, delete or so on request.
    The problem is express graphql automatically declines anything which is not a post or get request,
    so the "options" request is denied.
    The solution is to go to that middleware where I setup my cors headers and there, I check if my request
    method is equal to options and if it is an options request, then here I'll return res send status 200
    so I'll simply send an empty response with a status code of 200.
    I return response 200 so that nrxt() call  code is not executed and therefore options requests never make it to the graphql
    endpoint but still get a valid response.
  */

  if (req.method == "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(auth); // will run on every request that reach graphql endpoint  but will not denie request but will set auth to false where we use that in resolvers.

// This middleware is used to
app.put("/post-image", (req, res, next) => {
  // check if we are authenticated
  if (!req.isAuth) {
    const error = new Error("Not authenticated!");
    error.code = 401; // 401 is for authentication failed
    throw error;
  }

  // check if we don't have a file
  if (!req.file) {
    return res.status(200).json({ message: "No file provided!" });
  }

  // if we have a file  check for existence of body field called oldPath
  // if it exists then we have to delete the old file
  if (req.body.oldPath) {
    clearImage(req.body.oldPath);
  }

  // return the path of the file
  return res.status(201).json({
    message: "File stored.",
    filePath: req.file.path.replace("\\", "/"),
  }); // this is path where multer stored the file and will be used in frontend
});

app.use(
  "/graphql",
  graphqlHTTP({
    // needs two items i.e schema and rootValue
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: true, // this is for the GUI for testing
    // Handling errors
    customFormatErrorFn(err) {
      // checking if the error is from graphql
      if (!err.originalError) {
        return err;
      }
      // extracting the data from the error
      const data = err.originalError.data;
      const message = err.message || "An error occurred.";
      const code = err.originalError.code || 500;
      return { message: message, status: code, data: data };
    },
  })
);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then((result) => {
    app.listen(8080);
  })
  .catch((err) => console.log(err));
