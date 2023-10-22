const { model, Schema } = require("mongoose");

const userSchema = new Schema({
  email: { type: String, required: true },
  name: { type: String, required: true },
  password: { type: String, required: true, minlength: 6 },
  status: { type: String, default: "I am new!" },
  posts: [{ type: Schema.Types.ObjectId, ref: "Post" }], // This is a special type provided by mongoose
  // ref: "Post" means that this is a relation to the Post model
  // This is a one to many relationship
  // posts is the array of objects tjat will hold the ids of the posts
});

module.exports = model("User", userSchema);
