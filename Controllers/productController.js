const { Product } = require("../Models/product");
const { Op } = require("sequelize");
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
      filters.name = filters.name || "";
      filters.pageNumber = filters.pageNumber > 0 ? filters.pageNumber : 1;
      filters.numOfElements =
        filters.numOfElements > 0 ? filters.numOfElements : 5;
      const start = (filters.pageNumber - 1) * filters.numOfElements;
      const result = (
        await Product.findAll({
          where: {
            // ProductTitle: {
            //   [Op.iLike]: `%${filters.name}%`,
            // },
            // ProductPrice: {
            //   [Op.gte]: filters.minPrice || 0,
            //   [Op.lte]: filters.maxPrice || Infinity,
            // },
            ProductRatings: {
              [Op.gte]: filters.minRating || 0,
              [Op.lte]: filters.maxRating || 5,
            },
          },
          offset: start,
          limit: filters.numOfElements,
        })
      ).map((product) => ({
        id: product.ProductID,
        name: product.ProductTitle,
        price: parseFloat(product.ProductPrice),
        rating: parseFloat(product.ProductRatings),
        image: product.ProductImage,
      }));
      return res.status(200).json(result);
    } catch (error) {
      return serverError(res, error);
    }
  },
  getById: async (req, res) => {
    const productId = req.query.id.toString();

    let product = await Product.findOne({
      where: { ProductID: productId },
      raw: true,
    });
    const reviews = await ProductReview.findAll({
      attributes: { exclude: ["ProductID"] },
      where: { ProductID: productId },
      raw: true,
    });
    product.reviews = reviews;
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  },
};

module.exports = { ...requests };
