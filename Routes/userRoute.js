const express = require("express");
const router = express.Router();
const { validateModel } = require("../Middlewares/validations");
const userController = require("../Controllers/userController");
const authService = require("../Middlewares/auths");
const { User } = require("../Models/user");

router.post("/signUp", validateModel(User), userController.signUp);
router.post("/logIn", userController.logIn);
router.post("/logOut", authService.allowedTo("user"), userController.logOut);
router.post("/forgotPassword",userController.forgotPassword);
router.post("/verifyPassResetCode",userController.verifyPassResetCode);
router.put("/resetPassword",userController.resetPassword);
router.get("/getMyData", authService.allowedTo("user"), userController.getLoggedUserData);
router.put("/updateMyPassword", authService.allowedTo("user"), userController.updateLoggedUserPassword);
router.put("/updateMyData", authService.allowedTo("user"), userController.updateLoggedUserData);
router.post("/addToWishList", authService.allowedTo("user"), userController.addToWishList);
router.delete("/deleteFromWishList", authService.allowedTo("user"), userController.deleteFromWishList);
router.get("/showWhitchList", authService.allowedTo("user"), userController.showWhitchList);
router.delete("/deleteUser", authService.allowedTo("user"), userController.deleteUser);

module.exports = router;
