const express = require("express");
const bodyParser = require("body-parser");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const path = require("path");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

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
  res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

app.listen(3000);
