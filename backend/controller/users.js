import User from "../models/Usermodel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Function to register a new user
export const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    const ser = await User.findOne({ email });
    if (ser) {
      console.log("User already exists:", ser);
      return res.json({ message: "User already exists" });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashPassword });
    console.log("New user data (inside register backend1):", newUser);
    await newUser.save();
    console.log("New user data (inside register backend2):", newUser);
    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("New user data (inside login backend1):", email);

    const user = await User.findOne({ email });
    console.log("New user data (inside login backend2):", email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log("User found", email);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    console.log("pass matched", email);

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    // res.cookie("token", token, {
    //   httpOnly: true,
    //   secure: false, 
    //   sameSite: "lax",
    //   maxAge: 24 * 60 * 60 * 1000,
    // });

    res.cookie("token", token, { 
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000,
      });
      

    console.log("cookie created", email);

    res.json({ token, user });
  } catch (error) {
    res.json({ message: "Error logging in", error: error.message });
  }
};
