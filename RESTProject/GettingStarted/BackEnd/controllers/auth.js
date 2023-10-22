const User = require("../models/user");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signup = (req, res, next) => {
  // Check if there are any validation errors in the request
  const errors = validationResult(req); // validationResult is a function provided by express-validator to check if there are any errors in the request
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.statusCode = 422; // 422 is a good status code for validation errors
    error.data = errors.array();
    throw error; // This will be caught in the next catch block
  }

  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;

  // Password encryption

  bcrypt
    .hash(password, 12) // 12 is the number of rounds of hashing
    .then((hashedPassword) => {
      // Create user in db
      const user = new User({
        email: email,
        password: hashedPassword,
        name: name,
      });

      // to save the user to the database
      return user.save();
    })
    .then((result) => {
      res.status(201).json({
        // 201 is a good status code for a successful creation of a resource
        message: "User created successfully!",
        userId: result._id,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        // 500 is a good status code for a server error
        err.statusCode = 500;
      }
      next(err); // This will be caught in the next catch block
      // console.log(err);
    });
};

exports.login = (req, res, next) => {
  // Extract the email and password from the request
  const email = req.body.email;
  const password = req.body.password;

  // Check if there are any validation errors in the request
  const errors = validationResult(req); // validationResult is a function provided by express-validator to check if there are any errors in the request
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.statusCode = 422; // 422 is a good status code for validation errors
    error.data = errors.array();
    throw error; // This will be caught in the next catch block
  }

  let loadedUser;

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        // 401 is a good status code for authentication errors
        const error = new Error("A user with this email could not be found.");
        error.statusCode = 401;
        throw error; // This will be caught in the next catch block
      }
      loadedUser = user;
      // Compare the password entered by the user with the password stored in the database for that user

      return bcrypt.compare(password, user.password); // This will return true or false
    })
    .then((isEqual) => {
      if (!isEqual) {
        // 401 is a good status code for authentication errors
        const error = new Error("Wrong password!");
        error.statusCode = 401;
        throw error; // This will be caught in the next catch block
      }

      // Generate a Json Web token  JWT

      const token = jwt.sign(
        // creates a new signature based on the payload and the secret and packs that into new Json web token
        {
          email: loadedUser.email,
          userId: loadedUser._id.toString(),
        },
        process.env.JWT_SECRET, // This is the secret used to sign the token
        { expiresIn: "1h" } // This is the expiration time of the token
      );

      // Send the token to the client
      res.status(200).json({
        token: token,
        userId: loadedUser._id.toString(),
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        // 500 is a good status code for a server error
        err.statusCode = 500;
      }
      next(err); // This will be caught in the next catch block
      // console.log(err);
    });
};
