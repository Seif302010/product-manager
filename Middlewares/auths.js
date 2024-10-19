const jwt = require("jsonwebtoken");
require("dotenv").config();
const { User } = require("../Models/user");
const { Session } = require("../Models/session");
const dbFunctions = require("../GlobalFunctions/modelsFunctions");

const Protect = async (req, res, next) => {
  let token = req.headers.authorization || "";
  try {
    let session = await dbFunctions(Session).getOne({ token, isActive: true });
    if (!session || !session.userId) {
      return res.status(401).json({
        message: "You're Not Logged In, Please Login to get accces this route",
      });
    }
    let decoded = jwt.decode(token);
    const expirationDate = decoded.exp * 1000;
    if (Date.now() >= expirationDate) {
      await dbFunctions(Session).updateById(token, {
        isActive: false,
      });
      return res.status(401).json({
        message: "Token expired",
      });
    }
    req.user = await dbFunctions(User).getOne({ id: session.userId });
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
