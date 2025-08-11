import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import dotenv from "dotenv";
dotenv.config();

export const isAuthenticated = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "User Unauthorized" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decoded || !decoded.userId) {
      return res.status(401).json({ message: "Invalid token" });
    }
    req.id = decoded.userId;
    const isUser = await User.findById(req.id);
    if (!isUser) return res.status(401).json({ message: "Invalid token" });

    next();
  } catch (error) {
    console.error("Authentication Error:", error);
    res.status(401).json({ message: "Server error. Please try again later." });
  }
};
