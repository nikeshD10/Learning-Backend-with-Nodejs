const getDb = require("../util/database").getDb;
const mongodb = require("mongodb");

class Product {
  constructor(title, price, imageUrl, description) {
    this.title = title;
    this.price = price;
    this.imageUrl = imageUrl;
    this.description = description;
  }

  save() {
    // to save a product we need to connect to t he database
    const db = getDb();
    return db
      .collection("products")
      .insertOne(this)
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection("products")
      .find()
      .toArray()
      .then((products) => {
        console.log(products);
        return products;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static findById(prodId) {
    const db = getDb();
    return db
      .collection("products")
      .find({ _id: new mongodb.ObjectId(prodId) }) // find returns a cursor which is a pointer to the result
      .next() // next returns a promise which is a product
      .then((product) => {
        // then returns a product
        console.log(product);
        return product;
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

module.exports = Product;
