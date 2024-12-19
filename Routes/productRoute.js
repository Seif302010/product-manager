const express = require("express");
const router = express.Router();
const { validateModel } = require("../Middlewares/validations");
const productController = require("../Controllers/productController");
const authService = require("../Middlewares/auths");
const { router_template } = require("./template");
const { Product } = require("../Models/product");

const adminAuth = [authService.Protect, authService.allowedTo("admin")];
router.get("/", /*[adminAuth[0]],*/ productController.get);

module.exports = router;
