//
const { validationResult } = require("express-validator");

const Post = require("../models/post");

exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [
      {
        _id: "1",
        title: "First Post",
        content: "This is the first post!",
        imageUrl: "../images/Black Panther.jpg",
        creator: {
          // In frontend we are looking for creator and createdAt so we need to add them here
          name: "Maximilian",
        },
        createdAt: new Date(), // In frontend we are looking for creator and createdAt so we need to add them here
      },
    ],
  });
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req); // validationResult is a function provided by express-validator to check if there are any errors in the request
  if (!errors.isEmpty()) {
    // 422 is a good status code for validation errors
    return res.status(422).json({
      message: "Validation failed, entered data is incorrect.",
      errors: errors.array(),
    });
  }
  const title = req.body.title;
  const content = req.body.content;

  // Create post in db
  const post = new Post({
    title: title,
    content: content,
    imageUrl: "../images/Black Panther.jpg",
    creator: { name: "Aryan" },
  });

  // to save the post to the database
  post
    .save()
    .then(
      (result) => {
        console.log(result);
        res.status(201).json({
          // 201 is a good status code for a successful creation of a resource
          message: "Post created successfully!",
          post: result,
        });
      } // if there is an error
    )
    .catch((err) => {
      console.log(err);
    });
};
