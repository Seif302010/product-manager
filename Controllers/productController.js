const { Sequelize, fn, literal, Op } = require("sequelize");
const { Product } = require("../Models/product");
const { ProductMatches } = require("../Models/productMatches");
const { ProductReview } = require("../Models/productReview");
const { SellerReview } = require("../Models/sellerReview");
const { WishList } = require("../Models/wishList");

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
              `(SELECT COUNT(*) FROM wishList WHERE productId = product.ProductID AND userId = ${req.user.id})`
            ),
            "inWishList",
          ],
        ],
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
        attributes: {
          include: [
            [
              Sequelize.literal(
                `(SELECT CASE WHEN COUNT(*) > 0 THEN 1 ELSE 0 END FROM wishList WHERE productId = product.ProductID AND userId = ${req.user.id})`
              ),
              "inWishList",
            ],
          ],
        },
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
              [
                Sequelize.literal(
                  `(SELECT COUNT(*) FROM wishList WHERE productId = matchedProducts.ProductID AND userId = ${req.user.id})`
                ),
                "inWishList",
              ],
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
        attributes: [
          "reviewedID",
          [fn("COUNT", "*"), "Count"],
          [
            fn(
              "SUM",
              literal(`CASE WHEN sentiment = 'positive' THEN 1 ELSE 0 END`)
            ),
            "Positive",
          ],
        ],
        where: {
          [Op.or]: [
            { reviewedID: product.SellerName },
            {
              reviewedID: {
                [Op.in]: product.matchedProducts.map((item) => item.SellerName),
              },
            },
          ],
        },
        group: ["reviewedID"],
        raw: true,
      });
      const defaultObj = {
        Positive: 0,
        Negative: 0,
        Count: 0,
      };
      allReviews = allReviews.reduce((acc, { reviewedID, ...rest }) => {
        if (rest.Count > 0) {
          rest.Positive = (rest.Positive / rest.Count) * 100;
          rest.Negative = 100 - rest.Positive;
        }
        acc[reviewedID] = rest;
        return acc;
      }, {});
      product.sellerAnalysis = allReviews[product.SellerName] || defaultObj;
      product.matchedProducts = product.matchedProducts.map((match) => ({
        ...match,
        sellerAnalysis: allReviews[match.SellerName] || defaultObj,
      }));
      product.ProductSpecifications = JSON.parse(product.ProductSpecifications);
      return res.json(product);
    } catch (error) {
      return serverError(res, error);
    }
  },
};

module.exports = { ...requests };
