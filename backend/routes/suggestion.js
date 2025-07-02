import express from "express";
import { generateSmartSuggestions } from "../controller/suggestion.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", verifyToken, generateSmartSuggestions);

export default router;
