const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },

  cart: {
    items: [
      // array of documents
      {
        // How to get id of product from product model?
        // We can get ID from Schema object and it has types object id
        // Schema.Types.ObjectId we are saying it will store object id of product
        // But we know it stores which schema ID?
        // we do that by passing ref property and we pass the model name
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
});

// adding a method to userSchema
// This will be called in real instance based on that schema
userSchema.methods.addToCart = function (product) {
  const cartProductIndex = this.cart.items.findIndex((cp) => {
    return cp.productId.toString() === product._id.toString(); // we are converting both to string because one is object id and other is string
  });
  let newQuantity = 1;
  const updatedCartItems = [...this.cart.items];

  if (cartProductIndex >= 0) {
    // product already exists in the cart
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newQuantity; // updating the quantity
  }
  // product does not exists in the cart
  else {
    updatedCartItems.push({
      productId: product._id,
      quantity: newQuantity,
    });
  }
  // updating the cart
  const updatedCart = {
    items: updatedCartItems,
  };
  this.cart = updatedCart;
  return this.save();
};

module.exports = mongoose.model("User", userSchema); // mongoose will automatically create collection with name users
