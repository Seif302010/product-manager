const { Sequelize } = require("sequelize");
require("dotenv").config();

const env = process.env;

const connectionString = env.DB_CONNECTION_STRING;

const sequelize = new Sequelize(connectionString);

module.exports = { sequelize };
