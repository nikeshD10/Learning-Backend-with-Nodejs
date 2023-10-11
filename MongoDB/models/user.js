const getDb = require("../util/database").getDb;
const mongodb = require("mongodb");
class User {
  constructor(username, email, cart, id) {
    this.name = username;
    this.email = email;
    this.cart = cart; // {items: []}
    this._id = id;
  }

  save() {
    const db = getDb();
    return db.collection("users").insertOne(this);
  }

  // addToCart(product) {
  //   const db = getDb();
  //   // check if the product already exists in the cart
  //   const cartProductIndex = this.cart.items.findIndex((cp) => {
  //     return cp._id.toString() === product._id.toString();
  //   });
  //   // copy the cart items
  //   const updatedCartItems = [...this.cart.items];
  //   let newQuantity = 1;
  //   // if the product already exists in the cart
  //   if (cartProductIndex >= 0) {
  //     // update the quantity
  //     newQuantity = this.cart.items[cartProductIndex].quantity + 1;
  //     // update the cart items
  //     updatedCartItems[cartProductIndex].quantity = newQuantity;
  //   } else {
  //     // if the product doesn't exist in the cart
  //     // add the product to the cart
  //     updatedCartItems.push({
  //       productId: new mongodb.ObjectId(product._id),
  //       quantity: newQuantity,
  //     });
  //   }
  //   // copy the cart
  //   const updatedCart = {
  //     items: updatedCartItems,
  //   };
  //   // update the cart
  //   return db
  //     .collection("users")
  //     .updateOne(
  //       { _id: new mongodb.ObjectId(this._id) },
  //       { $set: { cart: updatedCart } }
  //     );
  // }

  addToCart(product) {
    const updatedCart = {
      items: [{ productId: new mongodb.ObjectId(product._id), quantity: 1 }],
    };

    // const updatedCart = { items: [{ ...product, quantity: 1 }] };

    const db = getDb();
    return db
      .collection("users")
      .updateOne(
        { _id: new mongodb.ObjectId(this._id) },
        { $set: { cart: updatedCart } }
      );
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
