const express = require("express");
const path = require("path");
const router = express.Router();

router.get("/", (req, res, next) => {
  // to construct path to the views shop.html we can use the path module provided by nodejs
  // this below param inside sendfile is the absolute path to the file
  // path.join() will automatically build a path to the file
  //__dirname is a global variable provided by nodejs which holds the absolute path to the project folder
  //__dirname is focusing on this current folder i.e routes folder
  // "../" is used to go one folder back from the current folder
  // "views" is the folder which holds the html files
  // "shop.html" is the html file we want to send

  res.sendFile(path.join(__dirname, "../", "views", "shop.html"));
});

module.exports = router;
