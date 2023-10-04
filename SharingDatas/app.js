const express = require("express");
const bodyParser = require("body-parser");
const adminData = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const path = require("path");
const rootDir = require("./util/path");

const app = express();

// setting global configuration values
// view-engine allows to tell , "hey for any dynamic templates we're trying to render
// please use this engine we're registering here"

// view allows us to tell express where to find these dynamic templates
app.set("view engine", "pug");
// if we have setted html template on other folders like templates then we need to mention here
// like app.set("views", "templates");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminData.routes);
app.use(shopRoutes);

app.use((req, res, next) => {
  // res.status(404).sendFile(path.join(rootDir, "views", "404.html"));
  res.status(404).render("404", {
    pageTitle: "Page Not Found",
  });
});

app.listen(3000);
