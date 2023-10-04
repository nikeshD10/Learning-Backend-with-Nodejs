const express = require("express");
const path = require("path");
const router = express.Router();
const rootDir = require("../util/path");
const adminData = require("./admin");

router.get("/", (req, res, next) => {
  // So this data is logged even after I reload even after I open localhost on other tab
  // this is because nodejs is a single threaded application and it is running on a single process
  // so the data is shared across all the users
  // this is not what we want to do we rarely exteremly rarely want to share data across like this
  // console.log("shop.js", adminData.products);
  // res.sendFile(path.join(rootDir, "views", "shop.html"));

  const products = adminData.products;

  // to send the pug
  res.render("shop", {
    prods: products,
    pageTitle: "Shop",
  });
});

module.exports = router;
