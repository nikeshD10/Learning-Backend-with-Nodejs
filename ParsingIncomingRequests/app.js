const http = require("http");

const express = require("express");

const bodyParser = require("body-parser");

// Creates an Express application. The express() function is a top-level function exported by the express module.
const app = express();

// defining body parser middleware before route handling middlewares
// body parser is a middleware that parses incoming request body
// and parses it into a format that we can easily read
// we can read it from req.body
// we need to register it as a middleware
app.use(bodyParser.urlencoded({ extended: false }));
// extended: false means that body parser will only look for default features
// here urlencoded() is registers a middleware function and returns that middleware function

// use allows us to add middleware to the request handling chain
// app.use((req, res, next) => {
//   console.log("In the middleware!");
//   next(); // Allows the request to continue to the next middleware in line
// });

app.use("/add-product", (req, res, next) => {
  res.send(
    '<form action="/product" method="POST"><input type="text" name="title"><button type="submit">Add Product</button></form>'
  ); // Sends response
  // we don't need to call next here because we are sending response
  // and we don't want to call next middleware in line
});

app.use("/product", (req, res, next) => {
  // logging incoming request body
  console.log(req.body);
  res.redirect("/");
});

// when I use "/" as path, it will match all paths that start with "/"
app.use("/", (req, res, next) => {
  console.log("This always runs!");
  res.send("<h1>Hello from Express!</h1>"); // Sends response
});

app.listen(3000);
