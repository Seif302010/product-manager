const express = require("express");
const router = express.Router();
const productController = require("../Controllers/productController");
const authService = require("../Middlewares/auths");

const userAuth = authService.allowedTo("user");
router.get("/", userAuth, productController.get);
router.get("/getById", userAuth, productController.getById);

module.exports = router;
