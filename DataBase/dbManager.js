const { sequelize } = require("./sequelize");

const { User } = require("../Models/user");
const { Session } = require("../Models/session");
const { Product } = require("../Models/product");
const { ProductReview } = require("../Models/productReview");
const { all } = require("../Routes/productRoute");

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
  try {
    if ((await Product.count()) === 0) {
      const seenProductIDs = new Set();
      const allData = require("../Data/Updated_project_Products_Datasets.json")
        .filter((item) => {
          if (seenProductIDs.has(item.ProductID)) {
            return false;
          }
          seenProductIDs.add(item.ProductID);
          return true;
        })
        .map((item) => ({
          ...item,
          ProductOldPrice:
            item.ProductOldPrice.trim() !== ""
              ? parseFloat(item.ProductOldPrice)
              : 0,
          ProductPrice:
            item.ProductPrice.trim() !== "" ? parseFloat(item.ProductPrice) : 0,
          ProductRatings:
            item.ProductRatings.trim() !== ""
              ? parseFloat(item.ProductRatings)
              : 0,
          ProductRatingCount:
            item.ProductRatingCount.trim() !== ""
              ? parseInt(item.ProductRatingCount)
              : 0,
          ProductSpecifications: JSON.stringify(item.ProductSpecifications),
        }));

      await Product.bulkCreate(allData, { validate: true, logging: false });
    }
  } catch (error) {
    console.log(error);
  }
};

const insertProductReviews = async () => {
  try {
    if ((await ProductReview.count()) === 0) {
      const noonReviews = require("../Data/noon/Noon_ALL_product_Reviews_Final.json");
      const jumiaReviews =
        require("../Data/jumia/Jumia_Products_Reviews.json").map((item) => ({
          ProductID: item.ProductID,
          review: item.ProductReviews,
          ratimg: item["Review Rating"],
        }));
      await ProductReview.bulkCreate(noonReviews, {
        validate: true,
        logging: false,
      });
      console.log("noon reviews inserted");
      await ProductReview.bulkCreate(jumiaReviews, {
        validate: true,
        logging: false,
      });
      console.log("jumia reviews inserted");
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = { asyncTables, insertProducts, insertProductReviews };
