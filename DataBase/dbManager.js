const { sequelize } = require("./sequelize");

const { User } = require("../Models/user");
const { Session } = require("../Models/session");
const { Product } = require("../Models/product");
const { ProductMatches } = require("../Models/productMatches");
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
    const allData = require("../Data/Project_Products_Datasets.json").map(
      (item) => ({
        ...item,
        ProductSpecifications: JSON.stringify(item.ProductSpecifications),
      })
    );
    if ((await Product.count()) === 0) {
      await Product.bulkCreate(allData, {
        validate: true,
        logging: false,
      });
      console.log("products inserted");
    }
    if ((await ProductMatches.count()) === 0) {
      const productMatches = [];
      allData.forEach((item) => {
        if (item.MatchedProducts && item.MatchedProducts.length > 0) {
          item.MatchedProducts.forEach((matchedProductId) => {
            productMatches.push({
              productId: item.ProductID,
              matchedProductId,
            });
          });
        }
      });
      if (productMatches.length > 0) {
        await ProductMatches.bulkCreate(productMatches, {
          validate: true,
          logging: false,
        });
        console.log("matched products inserted");
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const insertReviews = async () => {
  try {
    if ((await Review.count()) === 0) {
      const productReviews = require("../Data/products_reviews.json");
      const sellerReviews = require("../Data/Seller_Reviews.json");
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
