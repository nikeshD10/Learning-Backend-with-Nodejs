const requestHandler = (req, res) => {
  const url = req.url;
  const method = req.method;
  if (url === "/") {
    res.write("<html>");
    res.write("<head><title>Welcome to my assignment</title></head>");
    res.write(
      "<body><h1>Welcome enter your nikesh</h1><form action='/create-user' method='POST'><input type='text' name='username'><button type='submit'>Create User</button></form></body>"
    );
    res.write("</html>");

    return res.end(); // return to exit the function
  } else if (url === "/users") {
    res.write("<html>");
    res.write("<head><title>Users</title></head>");
    res.write("<body><ul><li>User 1</li><li>User 2</li></ul></body>");
    res.write("</html>");
    return res.end(); // return to exit the function
  } else if (url === "/create-user" && method === "POST") {
    const body = [];
    req.on("data", (chunk) => {
      body.push(chunk);
    });
    return req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();
      const username = parsedBody.split("=")[1];
      console.log(username);
      // now after this we also want to send response so we don't get stucked in this event loop
      res.statusCode = 302;
      res.setHeader("Location", "/");
      return res.end(); // return to exit the function
    });
  }
};

module.exports = requestHandler;
