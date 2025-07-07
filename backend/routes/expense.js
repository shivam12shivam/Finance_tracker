import express from "express";
import {
  addExpense,
  getExpenses,
  deleteExpense,
  updateExpense,
  monthlyexpenses,
} from "../controller/expenses.js";
import { verifyToken } from "../middleware/auth.js";
const router = express.Router();

router.post("/add", verifyToken, addExpense);
router.get("/", verifyToken, getExpenses);
router.delete("/:id", verifyToken, deleteExpense);
router.put("/:id", verifyToken, updateExpense);
router.patch("/:id", verifyToken, updateExpense);
router.get("/monthly",verifyToken, monthlyexpenses);

export default router;
