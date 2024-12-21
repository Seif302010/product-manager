const { Product } = require("../Models/product");
const { Sequelize, Op } = require("sequelize");
const dbFunctions = require("../GlobalFunctions/modelsFunctions")(Product);
const noonData = require("../Data/noon/Noon_ALL_product_Dataset_Final.json");
const jumiaData = require("../Data/jumia/Jumia_Data.json");
const { ProductReview } = require("../Models/productReview");
const allData = [...noonData, ...jumiaData];

const serverError = (res, error) => {
  return res
    .status(500)
    .json({ message: `Internal Server Error: ${error.message}` });
};

const requests = {
  get: async (req, res) => {
    try {
      const filters = req.query;
      filters.pageNumber = filters.pageNumber > 0 ? filters.pageNumber : 1;
      filters.numOfElements = parseInt(
        filters.numOfElements > 0 ? filters.numOfElements : 5
      );
      const start = (filters.pageNumber - 1) * filters.numOfElements;

      const conditions = {
        ProductTitle: {
          [Op.like]: `%${filters.name || ""}%`,
        },
        ProductPrice: {
          [Op.gte]: filters.minPrice || 0,
          [Op.lte]: filters.maxPrice || Number.MAX_SAFE_INTEGER,
        },
        ProductRatings: {
          [Op.gte]: filters.minRating || 0,
          [Op.lte]: filters.maxRating || 5,
        },
        Marketplace: {
          [Op.like]: `%${filters.marketplace || ""}%`,
        },
      };

      const result = await Product.findAndCountAll({
        where: conditions,
        offset: start,
        limit: filters.numOfElements,
      });
      const response = {
        data: result.rows.map((product) => ({
          id: product.ProductID,
          name: product.ProductTitle,
          price: product.ProductPrice,
          rating: product.ProductRatings,
          image: product.ProductImage,
        })),
        rowCount: result.count,
      };
      return res.status(200).json(response);
    } catch (error) {
      return serverError(res, error);
    }
  },
  getById: async (req, res) => {
    const productId = req.query.id.toString();
    try {
      let product = await Product.findOne({
        where: { ProductID: productId },
        raw: true,
      });
      const reviews = await ProductReview.findAll({
        attributes: { exclude: ["ProductID", "id"] },
        where: { ProductID: productId },
        raw: true,
      });
      product.reviews = reviews;
      product.ProductSpecifications = JSON.parse(product.ProductSpecifications);
      if (product) {
        res.json(product);
      } else {
        res.status(404).json({ message: "Product not found" });
      }
    } catch (error) {
      return serverError(res, error);
    }
  },
};

module.exports = { ...requests };
