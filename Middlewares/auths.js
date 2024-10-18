const jwt = require("jsonwebtoken");
require("dotenv").config();

const Protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return res
      .status(401)
      .json("You're Not Logged In, Please Login to get accces this route");
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  console.log(decoded);

  // const currentUser = await User.findById(decoded.userId);
  // if(!currentUser){
  //   return next(new Error("The User That belong to this token does no longer",401));
  // }

  req.user = currentUser;
  next();
};

const allowedTo =
  (...roles) =>
  async (req, res, next) => {
    if (!roles.includes(req.user.roles)) {
      return res.status(403).json("You are Not Allowed To Acces This Route");
    }
    next();
  };

module.exports = { Protect, allowedTo };
