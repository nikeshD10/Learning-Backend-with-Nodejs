const Cart = require("./cart");
// importing the database pool
const db = require("../util/database");

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    return db.execute(
      // the question marks are placeholders for the values we want to insert and it also prevents from SQL injection issues which is an attack pattern
      // where user can insert special data into our input fields in our webpage that runs as SQL queries
      "INSERT INTO products (title, price, imageUrl, description) VALUES (?, ?, ?, ?)",
      // the second argument is an array of the values we want to insert
      [this.title, this.price, this.imageUrl, this.description]
    );
  }

  static deleteById(id) {}

  // Now we don't need callback functions anymore we can return promises
  static fetchAll() {
    return db.execute("SELECT * FROM products");
  }

  static findById(id) {
    return db.execute("SELECT * FROM products WHERE products.id = ?", [id]);
  }
};
