const http = require("http");

const express = require("express");

// Creates an Express application. The express() function is a top-level function exported by the express module.
const app = express();

// use allows us to add middleware to the request handling chain
// accepts array of request handlers
// next is actually function that will be called by express when it is time to execute next middleware in line
// next() will call next middleware in line
// we can have multiple middleware functions
// order matters
app.use((req, res, next) => {
  console.log("In the middleware!");
  next(); // Allows the request to continue to the next middleware in line
});

app.use((req, res, next) => {
  console.log("In another middleware!");
  res.send("<h1>Hello from Express!</h1>"); // Sends response
});

// const server = http.createServer(app);
// server.listen(3000);
app.listen(3000);
