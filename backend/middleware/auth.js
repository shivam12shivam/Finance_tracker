import jwt from "jsonwebtoken";
import User from "../models/Usermodel.js";
export const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ success: false, message: "No token found" });

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    console.log("verified", verified);
    const user = await User.findById(verified.id).select("-password");

    if (!user) return res.status(401).json(false,"no user found");

    req.user = user; // Attach user to request
    next(); // Proceed to the next middleware/route handler
  } catch (err) {
    console.error("Invalid token", err);
    res.status(401).json(false,{ message: "Invalid token, not authorized" });
  }
};
