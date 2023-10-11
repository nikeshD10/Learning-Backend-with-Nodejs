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

module.exports = mongoose.model("User", userSchema); // mongoose will automatically create collection with name users
