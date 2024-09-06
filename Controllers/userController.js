const { User } = require("../Models/user");
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require('dotenv').config();

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
    errorMessages = await noDoublications(data);
    if (Object.keys(errorMessages).length > 0) {
      return res.status(400).json(errorMessages);
    }
    data.password = await bcrypt.hash(data.password, 10);
    const user = await User.create(data);
    const token = jwt.sign({userId: user.id},process.env.JWT_SECRET_KEY,{expiresIn:process.env.JWT_EXPIRE_TIME});
    return res.status(201).json(user,token);
    } 
    catch (error) {
    return res
      .status(500)
      .json({ message: `Internal Server Error: ${error.message}` });
  }
};
const logIn = async(req,res,next)=>
{
  try {
    const user = await User.findOne({
      where: { email: req.body.email }
    });
  
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
      return next(new Error('Incorrect Email or Password'));
    }
  
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: process.env.JWT_EXPIRE_TIME }
    );
  
    // Respond with success message and token
    res.status(200).json({
      message: "Logged In Successfully",
      token: token
    });
  } catch (error) {
    // Handle errors
    res.status(500).json({ message: error.message });
  }}
const Protect = async(req, res, next)=>{
  let token;
  if(req.headers.authorization)
  {
    token = req.headers.authorization.split(' ')[1];
  }
  if(!token)
  {
    return next(
      new Error('Your Not Log In, Please Login to get accces this route',401)
    )
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  console.log(decoded);

  // const currentUser = await User.findById(decoded.userId);
  // if(!currentUser){
  //   return next(new Error("The User That belong to this token does no longer",401));
  // }

  req.user = currentUser;
  next();
}

const allowedTo = (...roles)=>async(req,res,next)=>
  {
    if(!roles.includes(req.user.roles)){
      return next(new Error("You are Not Allowed To Acces This Route",403))
    }
    next();
  }


module.exports = {signUp,logIn,Protect};