const { sequelize } = require("../DataBase/sequelize");

const { DataTypes } = require("sequelize");

const Product = sequelize.define("product", {
  name: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Name is required.",
      },
      len: {
        args: [3, 50],
        msg: "Name must be between 3 and 50 characters long.",
      },
    },
  },
  price: {
    type: DataTypes.FLOAT,
    defaultValue:0.0,
    validate: {
        min: {
          args: [0],
          msg: "Price cannot be less than 0.",
        },
      },
  },
  rating: {
    type: DataTypes.FLOAT,
    defaultValue:0.0,
    validate: {
        max: {
          args: [5],
          msg: "Rating cannot be greater than 5.",
        },
        min: {
          args: [0],
          msg: "Rating cannot be less than 0.",
        },
      },
  },
});

module.exports = { Product };