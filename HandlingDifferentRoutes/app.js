const http = require("http");

const express = require("express");

// Creates an Express application. The express() function is a top-level function exported by the express module.
const app = express();

// use allows us to add middleware to the request handling chain
// app.use((req, res, next) => {
//   console.log("In the middleware!");
//   next(); // Allows the request to continue to the next middleware in line
// });

app.use("/create-user", (req, res, next) => {
  console.log("In create user middleware!");
  res.send("<h1>To create user!</h1>"); // Sends response
  // we don't need to call next here because we are sending response
  // and we don't want to call next middleware in line
});

// when I use "/" as path, it will match all paths that start with "/"
app.use("/", (req, res, next) => {
  console.log("In initial middleware!");
  res.send("<h1>Hello from Express!</h1>"); // Sends response
});

app.listen(3000);
