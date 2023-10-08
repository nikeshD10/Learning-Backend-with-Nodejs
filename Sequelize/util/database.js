// SEQUELIZE uses mysql2 package to connect to mysql database or behind the scenes it uses mysql2 package
// import Sequelize constructor from sequelize package
const { Sequelize } = require("sequelize");
// create a new Sequelize object and pass in the database name, username, password, and options
const sequelize = new Sequelize("node-complete", "root", "nikesh2001", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
