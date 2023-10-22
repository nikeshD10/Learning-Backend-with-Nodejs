const jwt = require("jsonwebtoken"); // to validate incoming tokens

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization"); // get is a method provided by express to get any header we want
  if (!authHeader) {
    // if the header is undefined or null
    const error = new Error("Not authenticated.");
    error.statusCode = 401; // 401 is a good status code for authentication errors
    throw error;
  }

  // extract the token from the incoming request
  const token = req.get("Authorization").split(" ")[1]; // get is a method provided by express to get any header we want
  let decodedToken;
  // try to decode the token
  try {
    // @params token: the token to verify
    // @params process.env.JWT_SECRET is the secret used to sign the token
    decodedToken = jwt.verify(token, process.env.JWT_SECRET); // decode and verify is a method provided by jsonwebtoken
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }
  // if the token is undefined or null
  if (!decodedToken) {
    const error = new Error("Not authenticated.");
    error.statusCode = 401;
    throw error;
  }
  // if the token is decoded and verified
  // extract the userId and store it in the request
  req.userId = decodedToken.userId; // userId is the key we used to store the userId in the token payload.
  /*
      Token has the three decoded parts:
      1. header
      2. payload
      3. signature
      The payload is the data we stored in the token
      The signature is used to verify the token
      The header is used to identify the algorithm used to sign the token

  */
  next(); // continue with the next middleware
};
