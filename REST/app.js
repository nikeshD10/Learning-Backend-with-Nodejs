// 1. ----------------- THIS CHUNK IS FOR NODE.JS EXPRESS SERVER SETUP -----------------
// const express = require("express");
// const app = express();
// app.listen(8080);

const express = require("express");
// 21: import body-parser
const bodyParser = require("body-parser");
const app = express();
// 2. To add some routes and to do something with them, we need body-parser so we can parse incoming request bodies

// 3. to handle http methods for path we need to use app.get, app.post, app.put, app.delete we will create a route for each of these methods
// 4. create a route folder
// 5. create a file feed.js in routes folder
// 12. import the feed.js file
const feedRoutes = require("./routes/feed");

// 13. register the feedRoutes for the request that starts with /feed
// 14. Right now /feed/posts is handled upto now.
/*
  we expect our clients to communicate with our API, with requests that contain json data just as we
  return json data. Json data is the data format we want to use both for requests and for responses
*/

// 22. Initialize body-parser
app.use(bodyParser.json()); // application/json
// 23. Now we can parse json data from the incoming request bodies
// 24. To test this we will create a post request in postman

// 26. Now to handle CORS errors we will add some headers to the response
// 27. Before I forward the request to routes,  We will add headers to all the responses
app.use((req, res, next) => {
  // 28. We will add headers to all the responses
  // 29. We will allow all domains to access our resources
  res.setHeader("Access-Control-Allow-Origin", "*"); // * means all domains
  // 30. We will allow the following headers
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization" // Content-Type and Authorization are the headers we will use
    // Authorization header is used to send a token to authenticate the user
  );
  // 31. We will allow the following methods
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  next();
});

app.use("/feed", feedRoutes);
app.listen(8080);
