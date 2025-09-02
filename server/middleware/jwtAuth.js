import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const authenticateToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ success: false, message: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
    const user = await User.findById(decoded.userId).select("-password");
    
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid token. User not found." });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(error.message);
    res.status(401).json({ success: false, message: "Invalid token." });
  }
};

export const protectAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Access denied. Please authenticate first." });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied. Admin privileges required." });
    }

    next();
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Server error." });
  }
};
