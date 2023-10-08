const fs = require("fs");
const path = require("path");

const p = path.join(path.dirname(require.main.filename), "data", "cart.json");

module.exports = class Cart {
  // we need on this cart though is a way to add and remove our products
  // Now the problem we have is the cart itself is not really an object we'll constantly recreate
  // not for every new product that we add we want to have a new cart,
  // instead there will always be a cart in our application and we just want to manage the products in there
  // we want to have one cart which we can add products to and which we can remove products from
  // so we need to store it somewhere and that's where we'll use a file based database

  static addProduct(id, productPrice) {
    /*
        Idea:
        Fetch the previous cart from our cart file
        Analyze the cart => Find existing product
        Add new product/ increase quantity
    */
    // Fetch the previous cart
    fs.readFile(p, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(fileContent);
      }
      // Analyze the cart => Find existing product
      const existingProductIndex = cart.products.findIndex((p) => p.id === id);
      const existingProduct = cart.products[existingProductIndex];
      // if we have an exisiting porduct then I will use updatedProduct to hold a copy of that existing product
      let updatedProduct;
      // Add new product/ increase quantity
      if (existingProduct) {
        updatedProduct = { ...existingProduct };
        updatedProduct.qty = updatedProduct.qty + 1;
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = { id: id, qty: 1 };
        cart.products = [...cart.products, updatedProduct];
      }
      // TO convert string to number we add extra + sign
      // how it works?
      // +productPrice => convert string to number
      // cart.totalPrice => convert string to number
      // +productPrice + cart.totalPrice => add two numbers
      // The +productPrice part is converting productPrice to a number by
      // applying the unary + operator to it.
      // This is a common way to ensure that productPrice is treated as a number in the addition operation.

      cart.totalPrice = cart.totalPrice + +productPrice;

      fs.writeFile(p, JSON.stringify(cart), (err) => {
        console.log(err);
      });
    });
  }

  static deleteProduct(id, productPrice) {
    fs.readFile(p, (err, fileContent) => {
      //if there is an error then we return
      if (err) {
        return;
      }
      // if there is no error then we continue
      // we parse the file content
      const updatedCart = { ...JSON.parse(fileContent) };
      // we find the product we want to delete
      const product = updatedCart.products.find((prod) => prod.id === id);
      // if we don't find the product then we return
      if (!product) {
        return;
      }
      // if we find the product then we continue
      // we extract the product quantity
      const productQty = product.qty;
      // we update the cart
      updatedCart.products = updatedCart.products.filter(
        (prod) => prod.id !== id
      );
      // we update the total price
      updatedCart.totalPrice =
        updatedCart.totalPrice - productPrice * productQty;

      fs.writeFile(p, JSON.stringify(updatedCart), (err) => {
        console.log(err);
      });
    });
  }

  static getCart(cb) {
    fs.readFile(p, (err, fileContent) => {
      const cart = JSON.parse(fileContent);
      // if we have an error then we call the callback function with an empty array
      if (err) {
        cb([]);
      } else {
        // if we don't have an error then we call the callback function with the parsed file content
        cb(cart);
      }
    });
  }
};
