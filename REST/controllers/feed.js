// Used in: REST/routes/feed.js

exports.getPosts = (req, res, next) => {
  // 15. we will not render views now, but we will send json data
  res.status(200).json({
    posts: [{ title: "First Post", content: "This is the first post!" }],
  });
  // 16. Now client has to render the User Interface based on the data we send or response we send
};

// 17. Now we will create a post request
exports.createPost = (req, res, next) => {
  // 18. we will not render views now, but we will send json data
  // 19. we will get the title and content from the request body
  // I expect the request body to have a title and content field
  const title = req.body.title;
  const content = req.body.content;
  // 20. we will send the status code 201 for successful creation of resource
  res.status(201).json({
    // 201 is for successful creation of resource
    message: "Post created successfully!",
    post: { id: new Date().toISOString(), title: title, content: content },
  });
};
