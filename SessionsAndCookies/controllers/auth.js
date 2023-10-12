exports.getLogin = (req, res, next) => {
  const isLoggedIn = req.get("Cookie").split(";")[0].trim().split("=")[1];
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: isLoggedIn,
  });
};

exports.postLogin = (req, res, next) => {
  // this data is lost after the response is sent so we need to use sessions
  // Note : redirection creates brand new request
  // req.isLoggedIn = true;

  res.setHeader("Set-Cookie", "loggedIn=true");
  res.redirect("/");
};
