const { sequelize } = require("./sequelize");

const { User } = require("../Models/user");

const asyncTables = async () => {
  try {
    await sequelize.sync();
    console.log("Tables synced successfully");
    return true;
  } catch (error) {
    console.error("Unable to sync table with model:", error);
    return false;
  }
};

module.exports = { asyncTables };
