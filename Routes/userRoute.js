const express = require("express");
const router = express.Router();
const { validateModel } = require("../Middlewares/validations");
const userController = require("../Controllers/userController");
const { User } = require("../Models/user")

router.post("/signUp", validateModel(User), userController.signUp);

module.exports = router;
