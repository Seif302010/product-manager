const express = require("express");
const router = express.Router();
const { validateModel } = require("../Middlewares/validations");
const productController = require("../Controllers/productController");
const { router_template } = require("./template");
const { Product } = require("../Models/product");

//  كتيرة يساعدنا يسهل الموضوع هو شغال بس لسا بشوف هو هيفيدنا ولا لا  requests  فيها APIs كنت عامله عشان لو هنعمل template ده
// انا عاملها عشان لاقيت نفسي بكرر اكواد  GlobalFunctions  هتلاقي حاجات زي كده في
router_template(
  router,
  [{ request: productController.get }],
  [
    {
      request: productController.post,
      middlewares: [validateModel(Product)],
    },
  ],
  [{ request: productController.put }],
  [{ request: productController.del }]
);

module.exports = router;
