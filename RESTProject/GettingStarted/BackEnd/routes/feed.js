const express = require("express");
const { body } = require("express-validator");
const feedController = require("../controllers/feed");

const router = express.Router();

// GET /feed/posts
router.get("/posts", feedController.getPosts);

// POST /feed/post
router.post(
  "/post",
  [
    // Note: it is best practice to have similar validation on the frontend and backend
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  feedController.createPost
);

router.get("/post/:postId", feedController.getPost);

router.put(
  "/post/:postId",
  [
    // Note: it is best practice to have similar validation on the frontend and backend
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  feedController.updatePost
);

// to delete the post
router.delete("/post/:postId", feedController.deletePost); // :postId is a dynamic segment

module.exports = router;
