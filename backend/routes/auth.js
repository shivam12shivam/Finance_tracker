import express from "express";
import { login, register } from "../controller/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.post("/logout", (req, res) => {
  console.log("inside logout \n");
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "None",
    secure: true, // must be true if using HTTPS (which Render does)
  });
  res.status(200).json({ message: "Logged out successfully" });
});

router.get("/check-auth", verifyToken, async (req, res) => {
  try {
    console.log("inside check auth \n");
    const token = req.cookies.token;
    res.status(200).json({
      user: req.user,
      token: token, 
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
export default router;
