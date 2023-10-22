const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    title: { type: String, required: true },
    imageUrl: { type: String, required: true },
    content: { type: String, required: true },
    // THis was like intermediate solution to store the userId
    // Now we know user then creator will nolonger be object but a reference to the user
    creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
    // creator: { type: Object, required: true },
  },
  { timestamps: true } // This will add createdAt and updatedAt fields to the schema
);

// Note: the first argument is the singular name of the collection that will be created for your model (Mongoose will create the collection for your model when you first save a document to the collection)
module.exports = mongoose.model("Post", postSchema);
