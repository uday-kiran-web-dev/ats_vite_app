const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  //Check authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      //Get token from hearer
      token = req.headers.authorization.split(" ")[1];

      //verifying token
      const decode = jwt.verify(token, process.env.JWT_SECRET);

      //Get user from db(excluding password)
      req.user = await User.findById(decode.id).select("-password");

      next();
    } catch (error) {
      return res.status(401).json({
        message: "Not authorized, token failed",
      });
      console.log(error.message);
    }
  }

  if (!token) {
    return res.status(401).json({
      message: "Not authorized, no token",
    });
  }
};

module.exports = { protect };
