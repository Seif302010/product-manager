const { User } = require("../Models/user");
const { Session } = require("../Models/session");
const { Op } = require("sequelize");
const dbFunctions = require("../GlobalFunctions/modelsFunctions");
const objFunctions = require("../GlobalFunctions/objectsFunctions");
const bcrypt = require("bcrypt");

const noDoublications = async (user) => {
  let messages = {};
  let existingUsers = await dbFunctions(User).get({
    [Op.or]: [
      { name: user.name },
      { email: user.email },
      ...(user.phone !== undefined ? [{ phone: user.phone }] : []),
    ],
  });
  for (const key in user) {
    if (existingUsers.find((u) => u[key] === user[key])) {
      messages[key] = `${key} already registered`;
    }
  }
  return messages;
};

const requests = {
  signUp: async (req, res) => {
    try {
      const data = req.body;
      if (data.phone === "") {
        data.phone = undefined;
      }
      errorMessages = await noDoublications(
        objFunctions.filterByAttributes(data, ["name", "email", "phone"])
      );
      if (Object.keys(errorMessages).length > 0) {
        return res.status(400).json(errorMessages);
      }
      data.password = await bcrypt.hash(data.password, 10);
      let user = await dbFunctions(User).create(data);

      const session = await dbFunctions(Session).create({
        userId: user.id,
      });
      user = user.get({ plain: true });
      delete user.password;
      user.token = session.token;
      return res.status(201).json(user);
    } catch (error) {
      return res
        .status(500)
        .json({ message: `Internal Server Error: ${error.message}` });
    }
  },

  logIn: async (req, res) => {
    try {
      let user = await User.findOne({
        where: { email: req.body.email },
      });

      if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
        return res.status(404).json("Incorrect Email or Password");
      }

      const session = await dbFunctions(Session).create({
        userId: user.id,
      });

      user = user.get({ plain: true });
      delete user.password;
      user.token = session.token;

      // Respond with success message and token
      return res.status(200).json(user);
    } catch (error) {
      // Handle errors
      return res.status(500).json({ message: error.message });
    }
  },
  logOut: async (req, res) => {
    try {
      const token = req.headers.authorization;
      await dbFunctions(Session).updateById(token, {
        isActive: false,
      });
      return res.status(200).json({ message: "Logged out!" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};

module.exports = { ...requests };
