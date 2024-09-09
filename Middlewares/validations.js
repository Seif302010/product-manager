const { User } = require("../Models/user");
const {
  filterByDeletingEmpty,
} = require("../GlobalFunctions/objectsFunctions");

const globalValidator = async (Model, data) => {
  const errorMessages = {};
  filterByDeletingEmpty(data);
  try {
    const model = Model.build(data);
    await model.validate();
  } catch (error) {
    error.errors.forEach((err) => {
      if (!errorMessages[err.path]) {
        errorMessages[err.path] = err.message;
      }
    });
  }
  return errorMessages;
};

// Model is the sequelize model you want to validate
const validateModel = (Model) => {
  return async (req, res, next) => {
    const errorMessages = await globalValidator(Model, req.body);
    if (Object.keys(errorMessages).length === 0) {
      next();
    } else {
      return res.status(400).json(errorMessages);
    }
  };
};

module.exports = { validateModel };
