const { sequelize } = require("./sequelize");

const { User } = require("../Models/user");
const { Session } = require("../Models/session");
const { Product } = require("../Models/product");
const { Review } = require("../Models/review");

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
      const reviewedProducts = new Set(
        require("../Data/products_reviews.json").map((item) => item.ProductID)
      );
      const seenProductIDs = new Set();
      const allData = require("../Data/Updated_project_Products_Datasets.json")
        .filter((item) => {
          if (
            seenProductIDs.has(item.ProductID) ||
            !reviewedProducts.has(item.ProductID)
          ) {
            return false;
          }
          seenProductIDs.add(item.ProductID);
          return true;
        })
        .map((item) => ({
          ...item,
          ProductOldPrice:
            item.ProductOldPrice.trim() !== ""
              ? parseFloat(item.ProductOldPrice.replace(/,/g, ""))
              : 0,
          ProductPrice:
            item.ProductPrice.trim() !== ""
              ? parseFloat(item.ProductPrice.replace(/,/g, ""))
              : 0,
          ProductRatings:
            item.ProductRatings.trim() !== ""
              ? parseFloat(item.ProductRatings.replace(/,/g, ""))
              : 0,
          ProductRatingCount:
            item.ProductRatingCount.trim() !== ""
              ? parseInt(item.ProductRatingCount)
              : 0,
          ProductSpecifications: JSON.stringify(item.ProductSpecifications),
        }));
      await Product.bulkCreate(allData, {
        validate: true,
        logging: false,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const insertReviews = async () => {
  try {
    if ((await Review.count()) === 0) {
      const productReviews = require("../Data/products_reviews.json").map(
        (item) => ({
          reviewedID: item.ProductID,
          review: item.ProductReviews || item.review,
          rating:
            item.rating || item["Review Rating"] === " "
              ? 0
              : parseFloat(item["Review Rating"]),
          category: item.Category || item.category,
          sentiment: item.Sentiment || item.sentiment,
        })
      );
      const sellerReviews = require("../Data/Seller_Reviews.json").map(
        (item) => ({
          reviewedID: item.SellerName,
          review: item.review,
          rating: item.rating,
          sentiment: item.Sentiment,
        })
      );
      const chunkSize = 10000;
      for (let i = 0; i < productReviews.length; i += chunkSize) {
        await Review.bulkCreate(productReviews.slice(i, i + chunkSize), {
          validate: true,
          logging: false,
        });
      }
      console.log("product reviews inserted");
      await Review.bulkCreate(sellerReviews, {
        validate: true,
        logging: false,
      });
      console.log("seller reviews inserted");
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = { asyncTables, insertProducts, insertReviews };
