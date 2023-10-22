const express = require("express");
const { body } = require("express-validator");
const feedController = require("../controllers/feed");
const isAuth = require("../middleware/isAuth");

const router = express.Router();

/*
Now that we're generating a token and we're passing it to the client,
we need to make sure that the client can pass back the token to the backend, to the rest API
and we then check for the A - existence and B - validity of the token before we allow the request to continue.

So we need to add a middleware to the routes where we want to protect the routes.
In this case, we want to protect the route where we create a new post.
So we need to add a middleware to the post route in feed.js.

on our feed routes, on all these routes, none of these routes should be public,
so if no token is attached to the incoming request, we should simply block access here
*/

// GET /feed/posts
router.get("/posts", isAuth, feedController.getPosts);

// POST /feed/post
router.post(
  "/post",
  isAuth,
  [
    // Note: it is best practice to have similar validation on the frontend and backend
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  feedController.createPost
);

router.get("/post/:postId", isAuth, feedController.getPost);

router.put(
  "/post/:postId",
  isAuth,
  [
    // Note: it is best practice to have similar validation on the frontend and backend
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  feedController.updatePost
);

// to delete the post
router.delete("/post/:postId", isAuth, feedController.deletePost); // :postId is a dynamic segment

module.exports = router;
