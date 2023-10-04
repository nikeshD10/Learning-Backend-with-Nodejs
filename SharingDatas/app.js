const express = require("express");
const bodyParser = require("body-parser");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const path = require("path");

const rootDir = require("./util/path");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

/*
  Now to use the css or public available files we cann't use node js path.
  We need to use express static middleware to access the public folder or css files
  express.static() is a middleware function provided by express
  express.static() will serve the static files from the public folder

  how does this works?
  when we try to access a file from the public folder
  express.static() will check if the file exists in the public folder
  if it exists then it will serve the file
  else it will pass the request to the next middleware
  if no middleware is left then it will send 404 error
  so we need to add this middleware before the routes
*/

app.use(express.static(path.join(__dirname, "public")));

/*
  adding a filter to the adminRoutes
  so that it only handles requests
  that start with /admin
  before : 
    app.use(adminRoutes);
  after :
    app.use('/admin', adminRoutes);
*/
app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use((req, res, next) => {
  // res
  //   .status(404)
  //   .sendFile(path.dirname(require.main.filename) + "/views/404.html");
  // res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
  res.status(404).sendFile(path.join(rootDir, "views", "404.html"));
});

app.listen(3000);
