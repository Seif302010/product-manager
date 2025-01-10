const { sequelize } = require("../DataBase/sequelize");

const { DataTypes } = require("sequelize");

const { Product } = require("./product");

const ProductReview = sequelize.define(
  "productReview",
  {
    review: {
      type: DataTypes.TEXT("long"),
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    sentiment: {
      type: DataTypes.STRING,
    },
    rating: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0,
    },
    reviewedID: {
      type: DataTypes.STRING,
      allowNull: true,
      references: {
        model: Product,
        key: "ProductID",
      },
    },
  },
  {
    timestamps: false,
    createdAt: false,
    updatedAt: false,
    id: false,
  }
);
module.exports = { ProductReview };
