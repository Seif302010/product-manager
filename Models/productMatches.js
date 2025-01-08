const { sequelize } = require("../DataBase/sequelize");

const { DataTypes } = require("sequelize");

const { Product } = require("./product");

const ProductMatches = sequelize.define(
  "productMatches",
  {
    productId: {
      type: DataTypes.STRING,
      references: {
        model: Product,
        key: "ProductID",
      },
      primaryKey: true,
    },
    matchedProductId: {
      type: DataTypes.STRING,
      references: {
        model: Product,
        key: "ProductID",
      },
      primaryKey: true,
    },
  },
  {
    timestamps: false,
    createdAt: false,
    updatedAt: false,
    id: false,
  }
);

module.exports = { ProductMatches };
