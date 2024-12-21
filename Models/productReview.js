const { sequelize } = require("../DataBase/sequelize");

const { DataTypes } = require("sequelize");
const { Product } = require("./product");

const ProductReview = sequelize.define(
  "productReview",
  {
    review: {
      type: DataTypes.TEXT("long"),
    },
    rating: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0,
    },
    ProductID: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: false,
    createdAt: false,
    updatedAt: false,
  }
);
module.exports = { ProductReview };
