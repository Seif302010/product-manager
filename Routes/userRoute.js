// في ملف Routes/userRoute.js
const express = require("express");
const router = express.Router();
const { validateUser } = require("../Middlewares/validations");
const userController = require("../Controllers/userController");
const authService = require("../Controllers/userController");

router.post("/signUp", validateUser, userController.signUp);
router.post("/logIn",authService.Protect,userController.logIn);

module.exports = router;
