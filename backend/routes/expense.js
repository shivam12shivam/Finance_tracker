import express from "express";
import {
  addExpense,
  getExpenses,
  deleteExpense,
  updateExpense,
} from "../controller/expenses.js";
import { verifyToken } from "../middleware/auth.js";
const router = express.Router();

router.post("/add", verifyToken, addExpense);
router.get("/", verifyToken, getExpenses);
router.delete("/:id", verifyToken, deleteExpense);
router.put("/:id", verifyToken, updateExpense);
router.patch("/:id", verifyToken, updateExpense);

export default router;
