const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.getLogin = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    // errorMessage: req.flash("error"), // error message will be set and will hold a value only if we have an error flashed into our session
    errorMessage: message,
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    errorMessage: message,
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  // Now try to find the user with the email
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        // if user is not found then redirect to login page
        req.flash("error", "Invalid email");
        return res.redirect("/login");
      }
      // validate the password
      // compare() method takes the password that we want to compare with the hashed password
      // compare() method returns a promise
      // if the validation fails then redirect to login page
      // if the validation is successful then redirect to home page
      bcrypt.compare(password, user.password).then((doMatch) => {
        if (doMatch) {
          req.session.isLoggedIn = true;
          req.session.user = user;
          // save() method is used to save the session in the database
          // save() method returns a promise
          // if the session is saved successfully then redirect to home page
          // if the session is not saved then redirect to login page
          return req.session.save((err) => {
            console.log(err);
            res.redirect("/");
          });
        }
        req.flash("error", "Invalid password.");
        res.redirect("/login");
      });
    })
    .catch((err) => console.log(err));
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  // Now validate the email and password
  // We will use the express-validator package for this
  // We will use the check() method to check the email and password
  // The check() method takes the field name as the first argument
  // The second argument is the error message that we want to show if the validation fails
  // We can chain multiple validation methods to the check() method
  // The isEmail() method checks if the field is a valid email address
  // The isLength() method checks if the field has a minimum length

  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        req.flash(
          "error",
          "Email already exists, please pick a different one."
        );

        return res.redirect("/signup");
      }
      // hash the password
      // hash take the first value as string i.e password and second value is salt value i.e which specifies round of hash that will be applied
      return bcrypt
        .hash(password, 12)
        .then((hashPassword) => {
          const user = new User({
            email: email,
            password: hashPassword,
            cart: { items: [] },
          });
          return user.save();
        })
        .then((result) => {
          res.redirect("/login");
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};
