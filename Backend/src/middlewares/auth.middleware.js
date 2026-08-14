const jwt = require("jsonwebtoken");
const tokenBlacklistModel = require("../models/blacklist.model");
const userModel = require("../models/user.model");

async function authUser(req, res, next) {
  try {
    // 🔥 1. TOKEN FROM COOKIE OR HEADER
    const token =
      req.cookies?.token ||
      req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Authentication token missing",
      });
    }

    // 🔥 2. VERIFY TOKEN FIRST (FASTER)
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        message: "Invalid or expired token",
      });
    }

    // 🔥 3. CHECK BLACKLIST
    const isBlacklisted = await tokenBlacklistModel.findOne({ token });

    if (isBlacklisted) {
      return res.status(401).json({
        message: "Token is blacklisted",
      });
    }

    // 🔥 4. GET FULL USER (IMPORTANT)
    const user = await userModel.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    // 🔥 5. ATTACH FULL USER
    req.user = user;

    next();

  } catch (err) {
    console.error("Auth Middleware Error:", err);

    return res.status(500).json({
      message: "Internal server error in auth middleware",
    });
  }
}

module.exports = { authUser };