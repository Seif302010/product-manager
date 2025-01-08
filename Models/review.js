const { sequelize } = require("../DataBase/sequelize");

const { DataTypes } = require("sequelize");
const Review = sequelize.define(
  "review",
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
    },
  },
  {
    timestamps: false,
    createdAt: false,
    updatedAt: false,
  }
);
module.exports = { Review };
