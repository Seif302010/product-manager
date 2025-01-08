const { sequelize } = require("../DataBase/sequelize");
const { DataTypes } = require("sequelize");
const { User } = require("./user");
const jwt = require("jsonwebtoken");

const Session = sequelize.define(
  "session",
  {
    token: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "id",
      },
      allowNull: true,
    },
    loggedInAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: true,
    },
    loggedOutAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: false,
    createdAt: false,
    updatedAt: false,
    id: false,
  }
);

async function generateUniqueToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });
}

Session.beforeCreate(async (session, options) => {
  if (session.userId) {
    session.token = await generateUniqueToken(session.userId);
  }
});

User.hasMany(Session, {
  foreignKey: "userId",
  onDelete: "SET NULL",
});

Session.belongsTo(User, {
  foreignKey: "userId",
});

module.exports = { Session };
