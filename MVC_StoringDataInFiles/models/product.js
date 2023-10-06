const fs = require("fs");
const path = require("path");

// Note: Here products is an array of product objects
// it is acting as products database
module.exports = class Product {
  constructor(t) {
    this.title = t;
  }

  save() {
    // we are pushing the product object into the products array
    // this represents the current object
    const p = path.join(
      path.dirname(require.main.filename),
      "data",
      "products.json"
    );
    fs.readFile(p, (err, fileContent) => {
      let prod = [];
      // if there is no error
      if (!err) {
        // we are parsing the fileContent
        // this is an array of products
        prod = JSON.parse(fileContent);
      }
      // we are pushing the current object into the products array
      prod.push(this);
      // we are writing the products array into the file
      // we are converting the products array into a string
      fs.writeFile(p, JSON.stringify(prod), (err) => {
        console.log(err);
      });
    });
  }

  // static means we can call this method directly on the class itself
  // and not on an instantiated object
  static fetchAll(cb) {
    const p = path.join(
      path.dirname(require.main.filename),
      "data",
      "products.json"
    );
    // we are reading the file
    // if there is no error
    // we are parsing the fileContent
    // this is an array of products
    // we are returning the products array
    // if there is an error
    // we are returning an empty array
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        cb([]);
      }
      // so why callback?
      // because we are reading the file asynchronously
      // and we are returning the products array
      // before the file is read
      // so we are passing a callback function
      // and we are calling the callback function
      // after the file is read
      // and error of undefined in shop.ejs file is handled.
      // since in that file we are checking  products.length > 0 but initially products is undefined
      // so we are passing an empty array as an argument to the callback function

      let prod = JSON.parse(fileContent);
      cb(prod);
    });
  }
};
