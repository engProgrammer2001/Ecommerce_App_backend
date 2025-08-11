import generateToken from "../config/generateToken.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";

export const userRegister = async (req, res) => {
  try {
    const { name, password, number, email, role, address } = req.body;

    if (!name || !password || !email) {
      return res
        .status(400)
        .json({ message: "Name , Password and Email fields are required" });
    }
    // if mobile number or email already exist then not register
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const existingMobile = await User.findOne({ number });
    if (existingMobile) {
      return res.status(400).json({ message: "Mobile number already exists" });
    }

    // hash password and save user
    const hashPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      password: hashPassword,
      email,
      number,
      role,
      address,
    });

    await user.save();
    const payload = {
      id: user._id,
    };
    const token = generateToken(payload);
    res
      .status(201)
      .json({ message: "User registered successfully", user, token });
  } catch (error) {
    console.log("error", error);
  }
};

// login api
export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = generateToken(user._id.toString());
    res.status(200).json({
      message: "Login successful",
      data: {
        _id: user._id,
        email: user.email,
        role: user.role,
        name: user.name,
        number: user.number,
        address: user.address,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// update profile
export const updateProfile = async (req, res) => {
  try {
    const { name, email, number, address } = req.body;
    const userId = req.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.name = name;
    user.email = email;
    user.number = number;
    user.address = address;
    await user.save();
    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// get profile
export const getProfile = async (req, res) => {
  try {
    const userId = req.id; 
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "Profile fetched successfully", user });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
