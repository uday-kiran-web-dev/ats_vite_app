const User = require("../models/User");

const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// CREATE USER AS RECRUITER/ADMIN
const createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, role } =
      req.body || {};

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        message: "First name, last name, email, and password are required.",
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        message: "User already exists with this email.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      role,
    });

    return res.status(201).json(user);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { firstName, lastName, email, role, phone, isActive } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        firstName,
        lastName,
        email,
        role,
        phone,
        ...(typeof isActive !== "undefined" ? { isActive } : {}),
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    ).select("-password");

    return res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getUserLogs = async (req, res) => {
  try {
    const users = await User.find({}).select(
      "firstName lastName email loginHistory lastLogin loginCount",
    );

    const logs = [];
    users.forEach((user) => {
      (user.loginHistory || []).forEach((entry) => {
        logs.push({
          userId: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          timestamp: entry.timestamp,
          ip: entry.ip,
          userAgent: entry.userAgent,
        });
      });
    });

    logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return res.status(200).json(logs);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const bcrypt = require("bcryptjs");

const updateCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { firstName, lastName, email, phone, password } = req.body;

    if (email && email !== user.email) {
      const emailExists = await User.findOne({
        email,
        _id: { $ne: user._id },
      });
      if (emailExists) {
        return res.status(400).json({
          message: "Another user already exists with this email.",
        });
      }
    }

    user.firstName = firstName ?? user.firstName;
    user.lastName = lastName ?? user.lastName;
    user.email = email ?? user.email;
    user.phone = phone ?? user.phone;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    const updatedUser = user.toObject();
    delete updatedUser.password;

    return res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.deleteOne();

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUsers,
  getUserById,
  getUserLogs,
  updateUser,
  updateCurrentUser,
  deleteUser,
  createUser,
};
