import express from "express";
import { setLimit, getLimits } from "../controller/Limits.js";
import { verifyToken } from "../middleware/auth.js";
const router = express.Router();

router.post("/", verifyToken, setLimit);
router.get("/", verifyToken, getLimits);

export default router;
