import pool from "../db/postgres.js";
import Expense from "../models/Expense.js";
import Limit from "../models/Limit.js";

export const generateMonthlySummary = async (req, res) => {
  try {
    const userId = req.user._id;
    const month = new Date().toISOString().slice(0, 7);
    const expenses = await Expense.find({
      userId,
      date: { $gte: new Date(`${month}-01`), $lte: new Date(`${month}-31`) },
    });

    const totalSpent = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
    const categoryTotals = {};
    expenses.forEach((e) => {
      categoryTotals[e.category] =
        (categoryTotals[e.category] || 0) + Number(e.amount);
    });
    const topCategory =
      Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0]?.[0] ||
      null;

    const limits = await Limit.find({ userId, month });
    const overbudgetCategories = limits
      .filter((lim) => categoryTotals[lim.category] > lim.amount)
      .map((lim) => lim.category)
      .join(", ");

    await pool.query(
      `INSERT INTO monthly_summaries (user_id, month, total_spent, top_category, overbudget_categories)
       VALUES ($1, $2, $3, $4, $5)`,
      [userId.toString(), month, totalSpent, topCategory, overbudgetCategories]
    );

    res.json({ message: "Monthly summary saved" });
  } catch (err) {
    res.status(500).json({ message: "Failed to save summary", error: err.message });
  }
};
