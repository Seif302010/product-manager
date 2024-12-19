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
      references: {
        model: Product,
        key: "ProductID",
      },
      allowNull: true,
    },
  },
  {
    timestamps: false,
    createdAt: false,
    updatedAt: false,
  }
);

Product.hasMany(ProductReview, {
  foreignKey: "ProductID",
  onDelete: "SET NULL",
});

ProductReview.belongsTo(Product, {
  foreignKey: "ProductID",
});

module.exports = { ProductReview };
