//
const { validationResult } = require("express-validator");

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
  res.status(201).json({
    message: "Post created successfully!",
    post: {
      id: new Date().toISOString(),
      title: title,
      content: content,
      creator: { name: "Aryan" },
      createdAt: new Date(),
    },
  });
};
