const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { model } = require("mongoose");
const { sendEmail, welcomeTemplate } = require("../services/emailService");

//Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

//Create or Register user
const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role, phone } = req.body;

    //Check if user exist using email
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists, Please try different Email",
      });
    }

    //Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //Create a User
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
      phone,
    });

    // Fire welcome email
    try {
      const mail = welcomeTemplate(user);
      await sendEmail({
        to: user.email,
        subject: mail.subject,
        html: mail.html,
        text: mail.text,
      });
    } catch (emailError) {
      console.error("Welcome email failed", emailError);
    }

    //Return Response
    res.status(201).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.log(`Error: ${error.message}`);

    res.status(500).json({
      message: error.message,
    });
  }
};

//Login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    //Check user exists or not
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid Email or Password" });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "User account is inactive." });
    }

    //Check password
    if (await bcrypt.compare(password, user.password)) {
      const loginEvent = {
        timestamp: new Date(),
        ip: req.ip,
        userAgent: req.headers["user-agent"] || "",
      };

      user.loginHistory = user.loginHistory || [];
      user.loginHistory.push(loginEvent);
      user.lastLogin = new Date();
      user.loginCount = (user.loginCount || 0) + 1;
      await user.save();

      res.json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        phone: user.phone,
        isActive: user.isActive,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({
        message: "Invalid Email or Password",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

//Get current user
const getMe = async (req, res) => {
  res.json(req.user);
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
