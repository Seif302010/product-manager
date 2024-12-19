const jwt = require("jsonwebtoken");
require("dotenv").config();
const { User } = require("../Models/user");
const { Session } = require("../Models/session");
const dbFunctions = require("../GlobalFunctions/modelsFunctions");

const Protect = async (req, res, next) => {
  let token = req.headers.authorization || "";
  try {
    if (token == "") {
      return res.status(401).json({
        message: "You are not logged in",
      });
    }
    let decoded = jwt.decode(token, process.env.JWT_SECRET_KEY);

    const expirationDate = decoded.exp * 1000;
    if (Date.now() >= expirationDate) {
      await dbFunctions(Session).updateById(token, {
        isActive: false,
      });
      return res.status(401).json({
        message: "Token expired",
      });
    }
    req.user = await dbFunctions(User).getOne({ id: decoded.userId });
    req.user.token = token;
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  next();
};

const allowedTo =
  (...roles) =>
  async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json("You are Not Allowed To Acces This Route");
    }
    next();
  };

module.exports = { Protect, allowedTo };
