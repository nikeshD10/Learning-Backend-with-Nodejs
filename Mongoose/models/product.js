const mongoose = require("mongoose");

const Schema = mongoose.Schema;

/*
  Mongodb is schemaless but why do we need schema here?
  - Mongoose is an ODM (Object Data Modeling) library for MongoDB and Node.js.
  - Idea is simply we know we have the flexibility of not being restricted to a specific schema in mongodb
  - We often will have a certain structure in the data we work with and 
  - therefore mongoose wants to give you the advantage of focusing on just your data
  - but for that, it needs to know how your data looks like and therefore we define such a schema for the
    structure our data will have. 
*/

// pass js object and define how product should look like. Define data schema for product
const productSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  userId: {
    // we are storing user id here
    type: Schema.Types.ObjectId,
    ref: "User", // we are setting up relation between product and user
    required: true,
  },
});

/*
  - Mongoose now also works with so-called models and the model is also what we'll export here,
  - Model is a function I call and a model basically is important for mongoose behind the scenes to connect
    a schema, a blueprint with a name basically,
  - The first argument you give that model a name and that name here would be product. Typically you name it here like
  - This with a capital starting character and then simply just well the name of the entity this reflects
    in your project or in your application.
  - The second argument then is the schema so in my case that product schema we defined and this model is what
    i export because this model is what we'll work with in our code.
*/
module.exports = mongoose.model("Product", productSchema);
// Mongoose take the model name i.e Product and turns it to all loweracse i.e product and takes the plural form i.e products of that
// and that will then be used as a collection name
