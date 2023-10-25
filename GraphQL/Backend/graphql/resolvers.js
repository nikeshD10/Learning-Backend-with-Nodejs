// resolver is an exported object with a resolver function for each API endpoint
// resolver functions are called by the GraphQL server when a query or mutation is executed
// the resolver function for the hello endpoint returns a string
// the resolver function for the hello endpoint is called when a query is executed
// the query is defined in the GraphQL/Backend/graphql/schema.js file

// module.exports = {
//   hello() {
//     return {
//       text: "Hello World!",
//       views: 1234,
//     };
//   },
// };

// Now we have the resolver and the schema we need to  expose them to public access
const User = require("../models/user");
const Post = require("../models/post");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const { clearImage } = require("../util/file");
module.exports = {
  // createUser is an endpoint

  createUser: async function (args, req) {
    const { email, name, password } = args.userInput;
    //Adding validation logic
    const errors = [];
    if (!validator.isEmail(email)) {
      errors.push({ message: "E-Mail is invalid." });
    }
    if (
      validator.isEmpty(password) ||
      !validator.isLength(password, { min: 5 })
    ) {
      errors.push({ message: "Password too short!" });
    }
    if (errors.length > 0) {
      const error = new Error("Invalid input.");
      error.data = errors;
      error.code = 422;
      throw error;
    }

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      const error = new Error("User exists already!");
      throw error;
    }
    const hashedPw = await bcrypt.hash(password, 12);
    const user = new User({
      email: email,
      name: name,
      password: hashedPw,
    });
    const createdUser = await user.save();
    return { ...createdUser._doc, _id: createdUser._id.toString() }; // This is the user object that will be returned by the API
    // _doc is a special property provided by mongoose which contains all the data of the user
    // _id is a special property provided by mongoose which contains the id of the user
  },

  login: async function ({ email, password }) {
    // get my user
    const user = await User.findOne({ email: email });
    if (!user) {
      const error = new Error("User not found.");
      error.code = 401; // 401 is for authentication failed
      throw error;
    }
    // check password
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error("Password is incorrect.");
      error.code = 401; // 401 is for authentication failed
      throw error;
    }
    // generate token
    // sign method is provided by jsonwebtoken which takes 3 arguments
    // 1st is the data I want to store in the token
    // 2nd is the secret key
    // 3rd is the expiration time
    // the token is a string
    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
      },
      "secretkeyjwt",
      { expiresIn: "1h" }
    );
    // return AuthData object
    return { token: token, userId: user._id.toString() };
  },

  // createPost is an endpoint
  // createPost: async function (args, req) {
  //   const { title, content, imageUrl } = args.postInput;

  //   // check if user is authenticated
  //   if (!req.isAuth) {
  //     const error = new Error("Not authenticated!");
  //     error.code = 401; // 401 is for authentication failed
  //     throw error;
  //   }

  //   // Adding validation logic
  //   const errors = [];
  //   if (validator.isEmpty(title) || !validator.isLength(title, { min: 5 })) {
  //     errors.push({ message: "Title is invalid." });
  //   }
  //   if (
  //     validator.isEmpty(content) ||
  //     !validator.isLength(content, { min: 5 })
  //   ) {
  //     errors.push({ message: "Content is invalid." });
  //   }
  //   if (errors.length > 0) {
  //     const error = new Error("Invalid input.");
  //     error.data = errors;
  //     error.code = 422; // 422 is for invalid input
  //     throw error;
  //   }

  //   // get my user
  //   const user = User.findById(req.userId);
  //   if (!user) {
  //     const error = new Error("Invalid user.");
  //     error.code = 401; // 401 is for authentication failed
  //     throw error;
  //   }

  //   // create a new post
  //   const post = new Post({
  //     title: title,
  //     content: content,
  //     imageUrl: imageUrl,
  //     creator: user,
  //   });

  //   // save the post
  //   const createdPost = await post.save(); // It will return a promise with resolved value as the post object
  //   // add post to user's posts
  //   user.posts.push(createdPost);
  //   await user.save();
  //   // return the post
  //   return {
  //     ...createdPost._doc,
  //     _id: createdPost._id.toString(),
  //     createdAt: createdPost.createdAt.toISOString(),
  //     updatedAt: createdPost.updatedAt.toISOString(),
  //   }; // This is the post object that will be returned by the API
  // },
  createPost: async function ({ postInput }, req) {
    if (!req.isAuth) {
      const error = new Error("Not authenticated!");
      error.code = 401;
      throw error;
    }
    const errors = [];
    if (
      validator.isEmpty(postInput.title) ||
      !validator.isLength(postInput.title, { min: 5 })
    ) {
      errors.push({ message: "Title is invalid." });
    }
    if (
      validator.isEmpty(postInput.content) ||
      !validator.isLength(postInput.content, { min: 5 })
    ) {
      errors.push({ message: "Content is invalid." });
    }
    if (errors.length > 0) {
      const error = new Error("Invalid input.");
      error.data = errors;
      error.code = 422;
      throw error;
    }
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error("Invalid user.");
      error.code = 401;
      throw error;
    }
    const post = new Post({
      title: postInput.title,
      content: postInput.content,
      imageUrl: postInput.imageUrl,
      creator: user,
    });
    const createdPost = await post.save();
    user.posts.push(createdPost);
    await user.save();
    return {
      ...createdPost._doc,
      _id: createdPost._id.toString(),
      createdAt: createdPost.createdAt.toISOString(),
      updatedAt: createdPost.updatedAt.toISOString(),
    };
  },

  posts: async function (args, req) {
    // check if user is authenticated
    if (!req.isAuth) {
      const error = new Error("Not authenticated!");
      error.code = 401; // 401 is for authentication failed
      throw error;
    }
    // get the page number
    const currentPage = args.page || 1;

    // get the page size
    const perPage = 2;

    // get the total number of posts
    const totalPosts = await Post.find().countDocuments();

    // get the posts
    const posts = await Post.find()
      .sort({ createdAt: -1 }) // sort by createdAt in descending order
      .skip((currentPage - 1) * perPage) // skip the first n posts
      .limit(perPage) // limit the number of posts to n
      .populate("creator"); // populate the creator field with the user object

    // return the posts
    return {
      // transforming the posts array
      posts: posts.map((p) => {
        // we use map because posts contains mongodb objects ID which needs to stringified so we use map to convert them to string
        return {
          ...p._doc,
          _id: p._id.toString(),
          createdAt: p.createdAt.toISOString(),
          updatedAt: p.updatedAt.toISOString(),
        };
      }),
      totalPosts: totalPosts,
    };
  },

  post: async function ({ id }, req) {
    // check if user is authenticated
    if (!req.isAuth) {
      const error = new Error("Not authenticated!");
      error.code = 401; // 401 is for authentication failed
      throw error;
    }
    // get the post
    const post = await Post.findById(id).populate("creator"); // populate the creator field with the user object
    // check if post exists
    if (!post) {
      const error = new Error("No post found!");
      error.code = 404; // 404 is for not found
      throw error;
    }
    // return the post
    return {
      ...post._doc,
      _id: post._id.toString(),
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    };
  },

  updatePost: async function ({ id, postInput }, req) {
    // check if user is authenticated
    console.log("Checking user is authenticated");
    if (!req.isAuth) {
      console.log("User is not authenticated");
      const error = new Error("Not authenticated!");
      error.code = 401; // 401 is for authentication failed
      throw error;
    }

    // get the post

    const post = await Post.findById(id).populate("creator"); // populate the creator field with the user object
    // check if post exists
    if (!post) {
      console.log("Post not found");
      const error = new Error("No post found!");
      error.code = 404; // 404 is for not found
      throw error;
    }
    // check if user is the creator of the post
    if (post.creator._id.toString() !== req.userId.toString()) {
      console.log("User is not the creator of the post");
      const error = new Error("Not authorized!");
      error.code = 403; // 403 is for forbidden
      throw error;
    }
    // Adding validation logic
    const errors = [];
    if (
      validator.isEmpty(postInput.title) ||
      !validator.isLength(postInput.title, { min: 5 })
    ) {
      errors.push({ message: "Title is invalid." });
    }
    if (
      validator.isEmpty(postInput.content) ||
      !validator.isLength(postInput.content, { min: 5 })
    ) {
      errors.push({ message: "Content is invalid." });
    }

    if (errors.length > 0) {
      console.log("Validation failed");
      const error = new Error("Invalid input.");
      error.data = errors;
      error.code = 422; // 422 is for invalid input
      throw error;
    }
    // update the post
    post.title = postInput.title;
    post.content = postInput.content;
    if (postInput.imageUrl !== "undefined") {
      console.log("Updating image");
      post.imageUrl = postInput.imageUrl;
    }
    const updatedPost = await post.save();
    console.log("Post updated");
    console.log(updatedPost);
    // return the post
    return {
      ...updatedPost._doc,
      _id: updatedPost._id.toString(),
      createdAt: updatedPost.createdAt.toISOString(),
      updatedAt: updatedPost.updatedAt.toISOString(),
    };
  },

  deletePost: async function ({ id }, req) {
    // check if user is authenticated
    if (!req.isAuth) {
      const error = new Error("Not authenticated!");
      error.code = 401; // 401 is for authentication failed
      throw error;
    }

    // get the post
    const post = await Post.findById(id);
    // check if post exists
    if (!post) {
      const error = new Error("No post found!");
      error.code = 404; // 404 is for not found
      throw error;
    }
    // check if user is the creator of the post
    if (post.creator.toString() !== req.userId.toString()) {
      const error = new Error("Not authorized!");
      error.code = 403; // 403 is for forbidden
      throw error;
    }

    // delete the post
    clearImage(post.imageUrl);
    await Post.findByIdAndRemove(id);
    // delete the post from the user's posts
    const user = await User.findById(req.userId);
    user.posts.pull(id);
    await user.save();
    // return true
    return true;
  },
  user: async function (args, req) {
    // check if user is authenticated
    if (!req.isAuth) {
      const error = new Error("Not authenticated!");
      error.code = 401; // 401 is for authentication failed
      throw error;
    }
    // get the user
    const user = await User.findById(req.userId);
    // check if user exists
    if (!user) {
      const error = new Error("No user found!");
      error.code = 404; // 404 is for not found
      throw error;
    }
    // return the user
    return {
      ...user._doc,
      _id: user._id.toString(),
    };
  },

  updateStatus: async function ({ status }, req) {
    // check if user is authenticated
    if (!req.isAuth) {
      const error = new Error("Not authenticated!");
      error.code = 401; // 401 is for authentication failed
      throw error;
    }

    // get the user
    const user = await User.findById(req.userId);
    // check if user exists
    if (!user) {
      const error = new Error("No user found!");
      error.code = 404; // 404 is for not found
      throw error;
    }

    // update the status
    user.status = status;
    await user.save();
    // return the user
    return {
      ...user._doc,
      _id: user._id.toString(),
    };
  },
};
