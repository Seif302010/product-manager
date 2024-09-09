const { Product } = require("../Models/product");

const nameExists = async (product) => {
  const existingProduct = await Product.findOne({
    where: {
      name: product.name,
    },
  });
  return !!existingProduct;
};

const todo = "not implemented yet";

const getAll = async (req, res) => {
  return res
    .status(404)
    .json({ message: todo, reqType: "get", reqName: "getAll" });
};
const getSearch = async (req, res) => {
  return res
    .status(404)
    .json({ message: todo, reqType: "get", reqName: "getSearch" });
};
const post = async (req, res) => {
  return res.status(404).json({ message: todo, reqType: "post" });
};
const put = async (req, res) => {
  return res.status(404).json({ message: todo, reqType: "put" });
};
const del = async (req, res) => {
  return res.status(404).json({ message: todo, reqType: "delete" });
};

module.exports = { getAll, getSearch, post, put, del };
