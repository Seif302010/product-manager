const { Product } = require("../Models/product");
const { Op } = require("sequelize");
const dbFunctions = require("../GlobalFunctions/modelsFunctions")(Product);
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
      const data = req.query;
      data.name = { [Op.like]: `%${data.name || ""}%` };
      return res.status(200).json(await dbFunctions.get(data));
    } catch (error) {
      return serverError(res, error);
    }
  },
  post: async (req, res) => {
    try {
      const data = req.body;
      console.log(data);
      if (await nameExists(data))
        return res.status(400).json({ name: "name already exists" });
      let product = await dbFunctions.create(data);
      return res.status(201).json(product);
    } catch (error) {
      return serverError(res, error);
    }
  },
  put: async (req, res) => {
    try {
      const data = filterByDeletingEmpty(req.body);
      const id = data.id || 0;
      delete data.id;
      if (await nameExists(data, id))
        return res.status(400).json({ name: "name already exists" });
      const affectedRows = await dbFunctions.updateById(id, data);
      if (affectedRows > 0) {
        return res
          .status(200)
          .json({ message: "Record updated successfully." });
      } else {
        return res.status(404).json({ message: "Record not found." });
      }
    } catch (error) {
      return serverError(res, error);
    }
  },
  del: async (req, res) => {
    try {
      id = req.body.id || 0;
      const affectedRows = await dbFunctions.deleteById(id);
      if (affectedRows > 0) {
        return res.status(200).json({ message: "Record deleted" });
      } else {
        return res.status(404).json({ message: "Record not found" });
      }
    } catch (error) {
      return serverError(res, error);
    }
  },
};

module.exports = { ...requests };
