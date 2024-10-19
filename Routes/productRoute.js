const express = require("express");
const router = express.Router();
const { validateModel } = require("../Middlewares/validations");
const productController = require("../Controllers/productController");
const authService = require("../Middlewares/auths");
const { router_template } = require("./template");
const { Product } = require("../Models/product");

//  كتيرة يساعدنا يسهل الموضوع هو شغال بس لسا بشوف هو هيفيدنا ولا لا  requests  فيها APIs كنت عامله عشان لو هنعمل template ده
// انا عاملها عشان لاقيت نفسي بكرر اكواد  GlobalFunctions  هتلاقي حاجات زي كده في

const adminAuth = [authService.Protect, authService.allowedTo("admin")];
router_template(
  router,
  [{ request: productController.get }],
  [
    {
      request: productController.post,
      middlewares: [...adminAuth, validateModel(Product)],
    },
  ],
  [
    {
      request: productController.put,
      middlewares: [...adminAuth],
    },
  ],
  [
    {
      request: productController.del,
      middlewares: [...adminAuth],
    },
  ]
);

module.exports = router;
