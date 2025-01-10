const { sequelize } = require("../DataBase/sequelize");
const { DataTypes } = require("sequelize");
const User = require("./user");
const Product = require("./product");
const WishList = sequelize.define(
  "WishList",
  {
    wishListId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    productId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: "products",
        key: "ProductID",
      },
      onDelete: "CASCADE",
    },
  },
  {
    timestamps: true,
    tableName: "wishList",
  }
);
WishList.associate = (models) => {
  WishList.belongsTo(models.User, { foreignKey: "userId", as: "user" });
  WishList.belongsTo(models.Product, {
    foreignKey: "productId",
    as: "product",
  });
};
module.exports = { WishList };
