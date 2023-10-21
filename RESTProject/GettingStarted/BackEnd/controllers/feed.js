const { validationResult } = require("express-validator");
const fs = require("fs");
const path = require("path");
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

  if (!req.file) {
    const error = new Error("No image provided.");
    error.statusCode = 422;
    throw error; // This will be caught in the next catch block
  }

  const title = req.body.title;
  const content = req.body.content;
  const imageUrl = req.file.path.replace("\\", "/"); // This is the path to the image

  // Create post in db
  const post = new Post({
    title: title,
    content: content,
    imageUrl: imageUrl,
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

exports.updatePost = (req, res, next) => {
  // extract the postId from the url
  const postId = req.params.postId;

  // Extract the data from the request
  const title = req.body.title;
  const content = req.body.content;
  let imageUrl = req.body.image; // This is the path to the image
  if (req.file) {
    imageUrl = req.file.path.replace("\\", "/"); // This is the path to the image
  }
  // Check if there are any validation errors in the request
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

  // Check if there is no image
  if (!imageUrl) {
    const error = new Error("No file picked.");
    error.statusCode = 422;
    throw error; // This will be caught in the next catch block
  }

  // Update the post in the database
  Post.findById(postId) // findById is a mongoose method
    .then((post) => {
      if (!post) {
        // 404 is a good status code for a resource not found
        const error = new Error("Could not find post.");
        error.statusCode = 404;
        throw error; // This will be caught in the next catch block
      }
      if (imageUrl !== post.imageUrl) {
        // check if the image url i.e path to image is not the same as the one stored in the old post stored in database
        clearImage(post.imageUrl); // This is a function defined below
      }
      post.title = title;
      post.imageUrl = imageUrl;
      post.content = content;
      return post.save(); // save() is a mongoose method
    })
    .then((result) => {
      res.status(200).json({ message: "Post updated!", post: result });
    })
    .catch((err) => {
      if (!err.statusCode) {
        // 500 is a good status code for a server error
        err.statusCode = 500;
      }
      next(err); // This will be caught in the next catch block
    });
};

const clearImage = (filePath) => {
  // __dirname to get current path .. will go to up one folder and we look for whatever filepath we get
  filePath = path.join(__dirname, "..", filePath); // This will construct an absolute path to that images folder
  fs.unlink(filePath, (err) => console.log(err)); // This will delete the file at the given path i.e images folder
};
