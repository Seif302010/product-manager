const express = require("express");
const router = express.Router();
const { validateUser } = require("../Middlewares/validations");
const userController = require("../Controllers/userController");

router.post("/signUp", validateUser, userController.signUp);

module.exports = router;
