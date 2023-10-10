const getDb = require("../util/database").getDb;
const mongodb = require("mongodb");

class Product {
  constructor(title, price, imageUrl, description, id) {
    this.title = title;
    this.price = price;
    this.imageUrl = imageUrl;
    this.description = description;
    this._id = id ? new mongodb.ObjectId(id) : null; // if id is not null then create a new object id
  }

  save() {
    // to save a product we need to connect to the database
    const db = getDb();
    let dbOp;
    if (this._id) {
      // update the product
      dbOp = db
        .collection("products")
        .updateOne({ _id: this._id }, { $set: this });
      // updateOne takes 2 arguments: the first is the filter i.e which document we want to update, the second is the update
      // $set is a special operator that tells mongodb what to update
    } else {
      // insert the product
      dbOp = db.collection("products").insertOne(this);
    }
    return dbOp
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
        return product;
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

module.exports = Product;
