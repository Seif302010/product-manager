const { sequelize } = require("../DataBase/sequelize");
const { v4: uuidv4 } = require("uuid");
const { DataTypes } = require("sequelize");
const { User } = require("./user");

const Session = sequelize.define("session", {
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
        key: 'id',
      },
      allowNull: true,
    },
  }, {
    timestamps: true,  // Enables createdAt
    createdAt: true,   // Explicitly enable createdAt
    updatedAt: false,  // Disable updatedAt
    id: false,         // Disable the automatic id column
  });

  async function generateUniqueToken() {
    let token;
    let isUnique = false;
  
    while (!isUnique) {
      token = uuidv4();
      const existingSession = await Session.findOne({ where: { token } });
      if (!existingSession) {
        isUnique = true;
      }
    }
  
    return token;
  }

  Session.beforeCreate(async (session, options) => {
    if (session.userId) {
      await Session.update(
        { isActive: false },
        {
          where: {
            userId: session.userId,
            isActive: true,
          },
        }
      );
    }
    if (!session.token) {
        session.token = await generateUniqueToken();  // Assign a unique token
    }
  });
  
  User.hasMany(Session, {
    foreignKey: 'userId',
    onDelete: 'SET NULL',
  });
  
  Session.belongsTo(User, {
    foreignKey: 'userId',
  });
  
  module.exports = { Session };