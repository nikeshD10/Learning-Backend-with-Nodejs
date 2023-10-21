//
const { validationResult } = require("express-validator");

const Post = require("../models/post");

exports.getPosts = (req, res, next) => {
  Post.find()
    .then((posts) => {
      res.status(200).json({
        message: "Fetched posts successfully.",
        posts: posts,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        // 500 is a good status code for a server error
        err.statusCode = 500;
      }
      next(err); // This will be caught in the next catch block
    });

  // res.status(200).json({
  //   posts: [
  //     {
  //       _id: "1",
  //       title: "First Post",
  //       content: "This is the first post!",
  //       imageUrl: "../images/Black Panther.jpg",
  //       creator: {
  //         // In frontend we are looking for creator and createdAt so we need to add them here
  //         name: "Maximilian",
  //       },
  //       createdAt: new Date(), // In frontend we are looking for creator and createdAt so we need to add them here
  //     },
  //   ],
  // });
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req); // validationResult is a function provided by express-validator to check if there are any errors in the request
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.statusCode = 422;
    throw error; // This will be caught in the next catch block

    // 422 is a good status code for validation errors
    // return res.status(422).json({
    //   message: "Validation failed, entered data is incorrect.",
    //   errors: errors.array(),
    // });
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
      if (!err.statusCode) {
        // 500 is a good status code for a server error
        err.statusCode = 500;
      }
      next(err); // This will be caught in the next catch block
      // console.log(err);
    });
};

exports.getPost = (req, res, next) => {
  // We are using req.params.postId because we are using a dynamic segment in the route
  const postId = req.params.postId;
  Post.findById(postId) // findById is a mongoose method
    .then((post) => {
      if (!post) {
        // 404 is a good status code for a resource not found
        const error = new Error("Could not find post.");
        error.statusCode = 404;
        throw error; // This will be caught in the next catch block
      }
      res.status(200).json({ message: "Post fetched.", post: post });
    })
    .catch((err) => {
      if (!err.statusCode) {
        // 500 is a good status code for a server error
        err.statusCode = 500;
      }
      next(err); // This will be caught in the next catch block
    });
};
