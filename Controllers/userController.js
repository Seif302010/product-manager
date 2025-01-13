const { User } = require("../Models/user");
const { Product } = require("../Models/product");
const { WishList } = require("../Models/wishList");
const { Session } = require("../Models/session");
const { Op } = require("sequelize");
const { serverError } = require("./errors");
const dbFunctions = require("../GlobalFunctions/modelsFunctions");
const objFunctions = require("../GlobalFunctions/objectsFunctions");
const bcrypt = require("bcrypt");
const sendEmail = require("../GlobalFunctions/sendEmail");
const crypto = require("crypto");

const noDoublications = async (user) => {
  let messages = {};
  let existingUsers = await dbFunctions(User).get({
    [Op.or]: [
      { name: user.name },
      { email: user.email },
      ...(user.phone !== undefined ? [{ phone: user.phone }] : []),
    ],
  });
  for (const key in user) {
    if (existingUsers.find((u) => u[key] === user[key])) {
      messages[key] = `${key} already registered`;
    }
  }
  return messages;
};

const requests = {
  signUp: async (req, res) => {
    try {
      const data = req.body;
      if (data.phone === "") {
        data.phone = undefined;
      }
      errorMessages = await noDoublications(
        objFunctions.filterByAttributes(data, ["name", "email", "phone"])
      );
      if (Object.keys(errorMessages).length > 0) {
        return res.status(400).json(errorMessages);
      }
      data.password = await bcrypt.hash(data.password, 10);
      let user = await dbFunctions(User).create(data);

      const session = await dbFunctions(Session).create({
        userId: user.id,
      });
      user = user.get({ plain: true });
      delete user.password;
      user.token = session.token;
      return res.status(201).json(user);
    } catch (error) {
      return serverError(res, error);
    }
  },

  logIn: async (req, res) => {
    try {
      let user = await User.findOne({
        where: { email: req.body.email },
      });

      if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
        return res.status(404).json({ message: "Incorrect Email or Password" });
      }

      const session = await dbFunctions(Session).create({
        userId: user.id,
      });

      user = user.get({ plain: true });
      delete user.password;
      user.token = session.token;
      return res.status(200).json(user);
    } catch (error) {
      return serverError(res, error);
    }
  },
  logOut: async (req, res) => {
    try {
      const token = req.headers.authorization;
      await dbFunctions(Session).updateById(token, {
        isActive: false,
        loggedOutAt: new Date(),
      });
      return res.status(200).json({ message: "Logged out!" });
    } catch (error) {
      return serverError(res, error);
    }
  },
  forgotPassword: async (req, res, next) => {
    const user = await User.findOne({
      where: { email: req.body.email },
    });

    if (!user) {
      return next(
        res.status(404).json({
          message: `There is no user with that email: ${req.body.email}`,
        })
      );
    }
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedResetCode = crypto
      .createHash("sha256")
      .update(resetCode)
      .digest("hex");

    user.passwordResetCode = hashedResetCode;

    user.passwordResetExpired = Date.now() + 10 * 60 * 1000;

    user.passwordResetVerified = false;

    await user.save();

    const message = `Hi ${user.name},\n We received a request to reset the password on your E-shop Account. \n ${resetCode} \n Enter this code to complete the reset. \n Thanks for helping us keep your account secure.\n The E-shop Team`;

    try {
      await sendEmail({
        email: user.email,
        subject: "Your password reset code (valid for 10 min)",
        message,
      });
    } catch (err) {
      user.passwordResetCode = undefined;
      user.passwordResetExpires = undefined;
      user.passwordResetVerified = undefined;

      await user.save();
      return next(new ApiError("There is an error in sending email", 500));
    }
    res
      .status(200)
      .json({ status: "Success", message: "Reset code sent to email" });
  },
  verifyPassResetCode: async (req, res, next) => {
    const hashedResetCode = crypto
      .createHash("sha256")
      .update(req.body.resetCode)
      .digest("hex");

    const user = await User.findOne({
      where: { passwordResetCode: hashedResetCode },
    });

    if (!user) {
      return next("Reset code invalid or expired");
    }

    user.passwordResetVerified = true;
    await user.save();

    res.status(200).json({ status: "Success" });
  },
  resetPassword: async (req, res, next) => {
    const user = await User.findOne({ where: { email: req.body.email } });
    if (!user) {
      return next("Reset code not verified");
    }
    user.password = await bcrypt.hash(req.body.newPassword, 12);
    user.passwordResetCode = null;
    user.passwordResetExpired = null;
    user.passwordResetVerified = false;

    await user.save();

    res.status(200).json({
      status: "Success",
    });
  },
  deleteUser: async (req, res, next) => {
    const userId = req.user.id;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found.",
      });
    }

    await user.destroy();

    res.status(200).json({
      status: "success",
      message: "user removed successfully.",
    });
  },
  getLoggedUserData: async (req, res, next) => {
    try {
      const userId = req.params.id;
      const user = await User.findOne(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Error fetching user", error });
    }
  },
  updateLoggedUserPassword: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const user = await User.findByPk(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      user.password = hashedPassword;
      user.passwordChangeDate = Date.now();

      await user.save();

      const session = await dbFunctions(Session).create({
        userId: user.id,
      });

      res.status(200).json({ data: user, token: req.user.token });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  updateLoggedUserData: async (req, res, next) => {
    try {
      const userId = req.user.id;

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      await User.update(
        {
          name: req.body.name || user.name,
          email: req.body.email || user.email,
          phone: req.body.phone || user.phone,
        },
        {
          where: { id: userId },
        }
      );

      const updatedUser = await User.findByPk(userId);

      res.status(200).json({ data: updatedUser });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  addToWishList: async (req, res) => {
    const { productId } = req.body;
    const userId = req.user.id;
    try {
      const product = await Product.findByPk(productId);
      if (!product) {
        return res.status(404).json({
          message: "Product not found.",
        });
      }

      const existingWishListItem = await WishList.findOne({
        where: { userId, productId },
      });

      if (existingWishListItem) {
        return res.status(400).json({
          message: "Product already exists in your wishlist.",
        });
      }
      await WishList.create({ userId, productId });
      return res.status(200).json({
        message: "Product added successfully to your wishlist.",
      });
    } catch (error) {
      return serverError(res, error);
    }
  },
  deleteFromWishList: async (req, res) => {
    const { productId } = req.body;
    const userId = req.user.id;
    try {
      const product = await Product.findByPk(productId);
      if (!product) {
        return res.status(404).json({
          message: "Product not found.",
        });
      }
      const wishListItem = await WishList.findOne({
        where: { userId, productId },
      });

      if (!wishListItem) {
        return res.status(404).json({
          message: "Product not found in your wishlist.",
        });
      }

      await wishListItem.destroy();

      return res.status(200).json({
        message: "Product removed successfully from your wishlist.",
      });
    } catch (error) {
      return serverError(res, error);
    }
  },
  showWishList: async (req, res) => {
    try {
      const userId = req.user.id;

      const wishlistItems = await WishList.findAll({
        where: { userId },
      });

      const productIds = wishlistItems.map((item) => item.productId);
      const products = await Product.findAll({
        where: {
          ProductID: {
            [Op.in]: productIds,
          },
        },
        attributes: [
          "ProductID",
          "ProductTitle",
          "ProductPrice",
          "ProductRatings",
          "ProductImage",
          "MarketPlace",
          "ProductDescription",
        ],
      });
      return res.status(200).json(products);
    } catch (error) {
      return serverError(res, error);
    }
  },
};

module.exports = { ...requests };
