import pool from "../db/mysql.js";
import Expense from "../models/Expense.js";
import Limit from "../models/Limit.js";

export const generateMonthlySummary = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log("Generating monthly summary for user:", userId);
    const month = new Date().toISOString().slice(0, 7);
    console.log("Current month:", month);
    const expenses = await Expense.find({
      userId,
      date: { $gte: new Date(`${month}-01`), $lte: new Date(`${month}-31`) },
    });
    console.log("Expenses for the month:", expenses);

    const totalSpent = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
    console.log("Total spent for the month:", totalSpent);
    const categoryTotals = {};
    expenses.forEach((e) => {
      categoryTotals[e.category] =
        (categoryTotals[e.category] || 0) + Number(e.amount);
    });
    console.log("Category totals:", categoryTotals);
    const topCategory =
      Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0]?.[0] ||
      null;

    const limits = await Limit.find({ userId, month });
    console.log("Limits for the month:", limits);
    const overbudgetCategories = limits
      .filter((lim) => categoryTotals[lim.category] > lim.amount)
      .map((lim) => lim.category)
      .join(", "); // For MySQL, store as comma-separated string
    console.log("Overbudget categories:", overbudgetCategories);
    try {
      await pool.query(
        `INSERT INTO monthly_summaries (user_id, month, total_spent, top_category, overbudget_categories)
         VALUES (?, ?, ?, ?, ?)`,
        [
          userId.toString(),
          month,
          totalSpent,
          topCategory,
          overbudgetCategories,
        ]
      );
    } catch (error) {
      console.error("Error saving monthly summary to MySQL:", error);
      res.json({ message: "Error saving summary to database" });
      return;
    }

    console.log("Monthly summary saved to MySQL");
    res.json({ message: "Monthly summary saved" });
  } catch (err) {
    res.json({ message: "Failed to save summary", error: err.message });
  }
};
