const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  // cookies are stored in the client side
  // const isLoggedIn = req.get("Cookie").split(";")[0].trim().split("=")[1];
  // const isLoggedIn = req.session.isLoggedIn;
  // console.log(req.session.isLoggedIn);

  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: false,
  });
};
exports.postLogin = (req, res, next) => {
  // this data is lost after the response is sent so we need to use sessions
  // Note : redirection creates brand new request
  // req.isLoggedIn = true;
  // res.setHeader("Set-Cookie", "loggedIn=true", HttpOnly);

  // Note:
  // 1. We can't store objects in sessions
  // 2. Sessions are stored in the server side
  // 2. By default sessions is stored in memory
  // 3. Sessions are stored in a cookie in the client side
  // This session object is added by session middleware
  // req.session.isLoggedIn = true;
  // res.redirect("/");

  User.findById("5bab316ce0a7c75f783cb8a8")
    .then((user) => {
      req.session.isLoggedIn = true;
      req.session.user = user;
      // This will ensure that the session is saved before the response is sent
      req.session.save((err) => {
        res.redirect("/");
      });
    })
    .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
  // Note: this will delete the session from the database
  req.session.destroy((err) => {
    // console.log(err);
    res.redirect("/");
  });
};
