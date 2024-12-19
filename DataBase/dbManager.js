const { sequelize } = require("./sequelize");

const { User } = require("../Models/user");
const { Session } = require("../Models/session");
const { Product } = require("../Models/product");
const { ProductReview } = require("../Models/productReview");

const asyncTables = async () => {
  try {
    await sequelize.sync();
    console.log("Tables synced successfully");
    return true;
  } catch (error) {
    console.error("Unable to sync table with model:", error);
    return false;
  }
};

const insertProducts = async () => {
  if (Product.count() === 0) {
    const noonData = require("../Data/noon/Noon_ALL_product_Dataset_Final.json");
    const jumiaData = require("../Data/jumia/Jumia_Data.json");
    let allData = [...noonData, ...jumiaData];
    allData = allData.map((item) => ({
      ...item,
      ProductOldPrice:
        item.ProductOldPrice.trim() !== ""
          ? parseFloat(item.ProductOldPrice)
          : 0,
      ProductPrice:
        item.ProductPrice.trim() !== "" ? parseFloat(item.ProductPrice) : 0,
      ProductRatings:
        item.ProductRatings.trim() !== "" ? parseFloat(item.ProductRatings) : 0,
      ProductRatingCount:
        item.ProductRatingCount.trim() !== ""
          ? parseInt(item.ProductRatingCount)
          : 0,
      ProductSpecifications: JSON.stringify(item.ProductSpecifications),
    }));
    Product.bulkCreate(allData, { validate: true });
  }
};

const insertProductReviews = async () => {
  if (Product.count() === 0) {
    const noonReviews = require("../Data/noon/Noon_ALL_product_Reviews_Final.json");
    const jumiaReviews =
      require("../Data/jumia/Jumia_Products_Reviews.json").map((item) => ({
        ProductID: item.ProductID,
        review: item.ProductReviews,
        ratimg: item["Review Rating"],
      }));
    const allReviews = [...jumiaReviews, noonReviews];
    ProductReview.bulkCreate(allReviews, { validate: true });
  }
};

module.exports = { asyncTables, insertProducts, insertProductReviews };
