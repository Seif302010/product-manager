const { Sequelize, Op } = require("sequelize");
const { Product } = require("../Models/product");
const { ProductMatches } = require("../Models/productMatches");
const { ProductReview } = require("../Models/productReview");
const { SellerReview } = require("../Models/sellerReview");

const { serverError } = require("./errors");

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
        ProductBrand: {
          [Op.like]: `%${filters.brand || ""}%`,
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
        attributes: [
          "ProductID",
          "ProductTitle",
          "ProductPrice",
          "ProductRatings",
          "ProductImage",
          "MarketPlace",
          "ProductDescription",
          [
            Sequelize.literal(
              "(SELECT COUNT(*) FROM ProductMatches WHERE ProductMatches.productId = product.ProductID)"
            ),
            "matchCount",
          ],
        ],

        include: [
          {
            model: Product,
            as: "matchedProducts",
            attributes: [],
          },
        ],
        order: [[Sequelize.literal("matchCount"), "DESC"]],
        offset: start,
        limit: filters.numOfElements,
      });
      const response = {
        data: result.rows,
        rowCount: result.count,
      };
      return res.status(200).json(response);
    } catch (error) {
      return serverError(res, error);
    }
  },
  getById: async (req, res) => {
    try {
      const productId = (req.query.id || "").toString();
      let product = await Product.findOne({
        where: { ProductID: productId },
        include: [
          {
            model: Product,
            as: "matchedProducts",
            attributes: [
              "ProductID",
              "ProductTitle",
              "ProductPrice",
              "ProductRatings",
              "ProductImage",
              "MarketPlace",
              "ProductDescription",
              "SellerName",
            ],
            through: { attributes: [] },
          },
          {
            model: ProductReview,
            as: "reviews",
            attributes: { exclude: ["id"] },
          },
        ],
        raw: false,
      });
      if (!product)
        return res.status(404).json({ message: "Product not found" });
      product = product.get({ plain: true });

      let allReviews = await SellerReview.findAll({
        attributes: { exclude: ["id"] },
        where: {
          [Op.or]: [
            { reviewedID: product.SellerName },
            {
              reviewedID: {
                [Op.in]: product.matchedProducts.map((item) => item.ProductID),
              },
            },
          ],
        },
        raw: true,
      });
      allReviews = allReviews.reduce((acc, review) => {
        const { reviewedID, ...rest } = review;
        if (!acc[reviewedID]) acc[reviewedID] = [];
        acc[reviewedID].push(rest);
        return acc;
      }, {});
      product.sellerReviews = allReviews[product.SellerName] || [];
      product.ProductSpecifications = JSON.parse(product.ProductSpecifications);
      product.matchedProducts = product.matchedProducts.map((match) => ({
        ...match,
        sellerReviews: allReviews[match.SellerName] || [],
      }));
      return res.json(product);
    } catch (error) {
      return serverError(res, error);
    }
  },
};

module.exports = { ...requests };
