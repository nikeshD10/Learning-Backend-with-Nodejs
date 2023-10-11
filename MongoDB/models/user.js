const getDb = require("../util/database").getDb;
const mongodb = require("mongodb");
class User {
  constructor(username, email, cart, id) {
    this.name = username;
    this.email = email;
    this.cart = cart; // {items: [{productId: 123, quantity: 2}]}
    this._id = id;
  }

  save() {
    const db = getDb();
    return db.collection("users").insertOne(this);
  }

  addToCart(product) {
    const db = getDb();
    // check if the product already exists in the cart
    const cartProductIndex = this.cart.items.findIndex((cp) => {
      return cp.productId.toString() === product._id.toString();
    });
    // copy the cart items
    const updatedCartItems = [...this.cart.items];
    let newQuantity = 1;
    // if the product already exists in the cart
    if (cartProductIndex >= 0) {
      // get previous quantity and increment by 1
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      // update the cart items quantity
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      // if the product doesn't exist in the cart
      // add the product to the cart
      updatedCartItems.push({
        productId: new mongodb.ObjectId(product._id),
        quantity: newQuantity,
      });
    }
    // copy the cart
    const updatedCart = {
      items: updatedCartItems,
    };
    // update the cart
    return db
      .collection("users")
      .updateOne(
        { _id: new mongodb.ObjectId(this._id) },
        { $set: { cart: updatedCart } }
      );
  }

  deleteItemFromCart(productId) {
    const db = getDb();
    // get the cart items
    const updatedCartItems = this.cart.items.filter((item) => {
      return item.productId.toString() !== productId.toString();
    });
    // copy the cart
    const updatedCart = {
      items: updatedCartItems,
    };
    // update the cart
    return db
      .collection("users")
      .updateOne(
        { _id: new mongodb.ObjectId(this._id) },
        { $set: { cart: updatedCart } }
      );
  }

  getCart() {
    const db = getDb();
    // get the product ids from the cart
    const productIds = this.cart.items.map((i) => {
      return i.productId;
    });
    // get the products from the product ids
    return db
      .collection("products")
      .find({ _id: { $in: productIds } }) // $in is a special operator that checks if the value is in the array
      .toArray()
      .then((products) => {
        // return the products with the quantity
        return products.map((p) => {
          return {
            ...p,
            quantity: this.cart.items.find((i) => {
              return i.productId.toString() === p._id.toString();
            }).quantity,
          };
        });
      });
  }

  static findById(userId) {
    const db = getDb();
    return (
      db
        .collection("users")
        // find returns a cursor which is a pointer to the result but
        // findOne immediately returns the user document after finding it so it doesn't return cursor
        // so instead of find we can use findOne
        .findOne({ _id: new mongodb.ObjectId(userId) })
        .then((user) => {
          return user;
        })
        .catch((err) => {
          console.log("Error finding user by ID !!!!!");
        })
    );
  }
}

module.exports = User;
