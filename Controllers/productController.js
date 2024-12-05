const { Product } = require("../Models/product");
const { Op } = require("sequelize");
const dbFunctions = require("../GlobalFunctions/modelsFunctions")(Product);
const noonData = require("../Data/noon/Noon_ALL_product_Dataset_Final.json");
const jumiaData = require("../Data/jumia/Jumia_Data.json");
const allData = [...noonData, ...jumiaData];
const {
  filterByDeletingEmpty,
} = require("../GlobalFunctions/objectsFunctions");

const nameExists = async (product, id = 0) => {
  const existingProducts = await dbFunctions.get({
    name: product.name,
    ...(id !== 0 && { id: { [Op.ne]: id } }),
  });

  return existingProducts.length > 0;
};

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
      filters.numOfElements =
        filters.numOfElements > 0 ? filters.numOfElements : 1;
      const start = (filters.pageNumber - 1) * filters.numOfElements;
      const result = allData.slice(start, start + filters.numOfElements);
      return res.status(200).json(result);
    } catch (error) {
      return serverError(res, error);
    }
  },
};

module.exports = { ...requests };
