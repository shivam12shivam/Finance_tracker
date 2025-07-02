import express from "express";
import { generateMonthlySummary } from "../controller/summary.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/save", verifyToken, generateMonthlySummary);

export default router;
