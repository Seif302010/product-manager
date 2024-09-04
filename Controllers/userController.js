const { User } = require("../Models/user");
const { Session } = require("../Models/session");
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");

const noDoublications = async (user) => {
  messages = {};
  const existingUsers = await User.findAll({
    where: {
      [Op.or]: [
        { name: user.name },
        { email: user.email },
        ...(user.phone !== undefined ? [{ phone: user.phone }] : []),
      ],
    },
  });

  if (existingUsers.length > 0) {
    if (existingUsers.find((u) => u.name === user.name)) {
      messages.name = "name already taken";
    }
    if (existingUsers.find((u) => u.email === user.email)) {
      messages.email = "email already registered";
    }
    if (existingUsers.find((u) => u.phone === user.phone)) {
      messages.phone = "phone already registered";
    }
  }
  return messages;
};

const signUp = async (req, res) => {
  try {
    const data = req.body;
    if (data.phone === "") {
      data.phone = undefined;
    }
    errorMessages = await noDoublications(data);
    if (Object.keys(errorMessages).length > 0) {
      return res.status(400).json(errorMessages);
    }
    data.password = await bcrypt.hash(data.password, 10);
    let user = await User.create(data);

    const session = await Session.create({
      userId: user.id,
    });
    user = user.get({ plain: true });
    delete user.password
    user.token = session.token;
    return res.status(201).json(user);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Internal Server Error: ${error.message}` });
  }
};

module.exports = { signUp };
