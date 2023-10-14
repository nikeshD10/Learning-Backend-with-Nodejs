const express = require("express");
// Typically we want to validate on post requests, not get requests.
// This is because get requests are used to fetch data, not to change data.
// We can use the check() method to validate a field.
// We can chain multiple checks together.
// We can use the isEmail() method to validate that the email is valid.
// We can use the isLength() method to validate that the password is a certain length.
// We can use the trim() method to remove whitespace from the beginning and end of the input.
// We can use the normalizeEmail() method to normalize the email address.
// We can use the withMessage() method to add a custom error message.
// We can use the custom() method to add a custom validation function.
const { check, body } = require("express-validator/check");

const User = require("../models/user");

const authController = require("../controllers/auth");

const router = express.Router();

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Please enter a valid email address."),
    body("password", "Password has to be valid.")
      .isLength({ min: 5 })
      .isAlphanumeric(),
  ],
  authController.postLogin
);

router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter the valid email!")
      .custom((value, { req }) => {
        // if (value.split("@")[1] !== "gmail.com") {
        //   throw new Error("This email address is forbidden.");
        // }
        // return true;

        User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject(
              "Email exists already, please pick a different one."
            );
          }
        });
      }),

    body(
      "password",
      "Please enter a password with only numbers and text and at least 5 characters." // This is a custom error message. so we don't repeat withMessage on different error message or on different validators
    )
      .isLength({ min: 5 })
      .isAlphanumeric(),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password have to match!");
      }
      return true;
    }),
  ],
  authController.postSignup
);

router.post("/logout", authController.postLogout);

router.get("/reset", authController.getReset);

router.post("/reset", authController.postReset);

router.get("/reset/:token", authController.getNewPassword);

router.post("/new-password", authController.postNewPassword);

module.exports = router;
