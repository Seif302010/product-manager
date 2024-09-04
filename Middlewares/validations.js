const { User } = require("../Models/user");

const validateUser = async (req, res, next) => {
  try {
    if (req.body.phone === "") {
      req.body.phone = undefined;
    }
    const user = User.build(req.body);
    await user.validate();
    next();
  } catch (error) {
    const errorMessages = {};
    error.errors.forEach((err) => {
      if (!errorMessages[err.path]) {
        errorMessages[err.path] = err.message;
      }
    });
    return res.status(400).json(errorMessages);
  }
};

module.exports = { validateUser };
