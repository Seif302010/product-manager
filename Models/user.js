const { sequelize } = require("../DataBase/sequelize");

const { DataTypes } = require("sequelize");

const User = sequelize.define("user", {
  name: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Name is required.",
      },
      len: {
        args: [3, 50],
        msg: "Name must be between 3 and 50 characters long.",
      },
    },
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Email is required.",
      },
      len: {
        args: [1, 254],
        msg: "Email can't exceed 254 characters.",
      },
      isEmail: {
        args: true,
        msg: "Invalid email format.",
      },
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Password is required.",
      },
      len: {
        args: [8, 60],
        msg: "Password must be between 8 and 60 characters long.",
      },
    },
  },
  role:{
    type:DataTypes.STRING,
    enum:['admin','user'],
    default:'user'
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: {
        args: [10, 20],
        msg: "Phone number must be between 10 and 20 characters long.",
      },
    },
  },
});

User.afterSync(async () => {
  const [results] = await sequelize.query(`
    SELECT name 
    FROM sys.indexes 
    WHERE name = 'unique_phone' AND object_id = OBJECT_ID('users');
  `);

  if (results.length === 0) {
    await sequelize.query(`
      CREATE UNIQUE INDEX unique_phone ON users(phone) WHERE phone IS NOT NULL;
    `);
  }
});

module.exports = { User };
