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
  static fetchAll() {
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
        return [];
      }
      let prod = JSON.parse(fileContent);
      console.log(prod);
      return prod;
    });
  }
};
