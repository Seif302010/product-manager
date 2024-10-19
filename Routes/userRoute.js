const express = require("express");
const router = express.Router();
const { validateModel } = require("../Middlewares/validations");
const userController = require("../Controllers/userController");
const authService = require("../Middlewares/auths");
const { User } = require("../Models/user");

router.post("/signUp", validateModel(User), userController.signUp);
router.post("/logIn", userController.logIn);
router.post("/logOut", authService.Protect, userController.logOut);

module.exports = router;
