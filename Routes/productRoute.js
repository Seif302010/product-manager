const express = require("express");
const router = express.Router();
const { validateModel } = require("../Middlewares/validations");
const productController = require("../Controllers/productController");
const { router_template } = require("./template");
const { Product } = require("../Models/product");

router.get("/search", productController.getSearch);

router_template(
  router,
  { request: productController.getAll },
  {
    request: productController.post,
    middlewares: [validateModel(Product)],
  },
  { request: productController.put },
  { request: productController.del }
);

module.exports = router;
