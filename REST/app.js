// 1. ----------------- THIS CHUNK IS FOR NODE.JS EXPRESS SERVER SETUP -----------------
// const express = require("express");
// const app = express();
// app.listen(8080);

const express = require("express");
const app = express();
// 2. To add some routes and to do something with them, we need body-parser so we can parse incoming request bodies

// 3. to handle http methods for path we need to use app.get, app.post, app.put, app.delete we will create a route for each of these methods
// 4. create a route folder
// 5. create a file feed.js in routes folder
// 12. import the feed.js file
const feedRoutes = require("./routes/feed");

// 13. register the feedRoutes for the request that starts with /feed
// 14. Right now /feed/posts is handled upto now.
app.use("/feed", feedRoutes);
app.listen(8080);
