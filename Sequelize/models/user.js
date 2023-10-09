const { DataTypes } = require("sequelize");

const sequelize = require("../util/database");

const User = sequelize.define("user", {
  id: {
    // type is defined by Sequelize Object
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  name: DataTypes.STRING,
  email: DataTypes.STRING,
});

module.exports = User;
