const express = require("express");
const router = express.Router();
const feedController = require("../controllers/feed");

// 6. create a route for GET request to /feed/posts
// 7. to handle logic for the get request we need to create a controller folder
// 8. create a file feed.js in controller folder
// 9. import the feedcontroller file
// 10. assign the feed controller get posts function to the get request that should be executed when a get request reaches this route
// 11. To be able to reach the route we need to register our route in the app.js file
router.get("/posts", feedController.getPosts);

module.exports = router;
