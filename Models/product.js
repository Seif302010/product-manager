const { sequelize } = require("../DataBase/sequelize");

const { DataTypes } = require("sequelize");

const Product = sequelize.define(
  "product",
  {
    ProductID: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    Marketplace: {
      type: DataTypes.STRING,
    },
    ProductBrand: {
      type: DataTypes.STRING,
    },
    ProductCategory: {
      type: DataTypes.STRING,
    },
    ProductDescription: {
      type: DataTypes.TEXT("long"),
    },
    ProductImage: {
      type: DataTypes.TEXT("long"),
    },
    ProductLink: {
      type: DataTypes.TEXT("long"),
    },
    ProductOldPrice: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0,
    },
    ProductPrice: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0,
    },
    ProductRatingCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    ProductRatings: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0,
    },
    ProductSpecifications: {
      type: DataTypes.TEXT("long"),
    },
    ProductSubCategory: {
      type: DataTypes.STRING,
    },
    ProductTitle: {
      type: DataTypes.STRING,
    },
    SellerName: {
      type: DataTypes.STRING,
    },
    SellerUrl: {
      type: DataTypes.TEXT("long"),
    },
  },
  {
    timestamps: false,
    createdAt: false,
    updatedAt: false,
    id: false,
  }
);

module.exports = { Product };
