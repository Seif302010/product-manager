const { sequelize } = require("../DataBase/sequelize");

const { DataTypes } = require("sequelize");

const SellerReview = sequelize.define(
  "sellerReview",
  {
    review: {
      type: DataTypes.TEXT("long"),
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
    },
  },
  {
    timestamps: false,
    createdAt: false,
    updatedAt: false,
    id: false,
  }
);
module.exports = { SellerReview };
