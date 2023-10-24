const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    req.isAuth = false; // This is not a valid request
    return next();
  }
  const token = authHeader.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, "secretkeyjwt");
  } catch (err) {
    req.isAuth = false; // This is not a valid request
    return next();
  }
  if (!decodedToken) {
    req.isAuth = false; // This is not a valid request
    return next();
  }
  req.userId = decodedToken.userId;
  req.isAuth = true; // This is a valid request
  next();
};
