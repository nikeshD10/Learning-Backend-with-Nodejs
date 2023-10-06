// Note: Here products is an array of product objects
// it is acting as products database
const products = [];

module.exports = class Product {
  constructor(t) {
    this.title = t;
  }

  save() {
    // we are pushing the product object into the products array
    // this represents the current object
    products.push(this);
  }

  // static means we can call this method directly on the class itself
  // and not on an instantiated object
  static fetchAll() {
    return products;
  }
};
