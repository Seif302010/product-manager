const { Sequelize } = require("sequelize");
require("dotenv").config();

const env = process.env;

const connectionString = env.DB_CONNECTION_STRING;


const sequelize = new Sequelize(connectionString, {
    dialect: 'mssql', 
    logging: false    
});


module.exports = { sequelize };
