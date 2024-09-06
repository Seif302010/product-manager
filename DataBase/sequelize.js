const { Sequelize } = require("sequelize");
require("dotenv").config();

const env = process.env;

// سلسلة الاتصال من ملف البيئة
const connectionString = env.DB_CONNECTION_STRING;

// إنشاء كائن Sequelize مع تحديد نوع القاعدة
const sequelize = new Sequelize(connectionString, {
  dialect: 'mssql', // تحديد نوع القاعدة كـ mssql
  logging: false    // تعطيل تسجيل الاستعلامات (اختياري)
});

module.exports = { sequelize };
