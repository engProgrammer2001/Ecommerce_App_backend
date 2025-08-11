import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET_KEY;

  // Create a proper payload object
  const payload = {
    userId: userId,
  };

  const options = {
    expiresIn: "30d",
  };

  return jwt.sign(payload, secret, options);
};

export default generateToken;
