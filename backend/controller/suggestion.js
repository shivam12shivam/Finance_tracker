import Expense from "../models/Expense.js";
import { spawn } from "child_process";

export const generateSmartSuggestions = async (req, res) => {
  try {
    const userId = req.user._id;
    const expenses = await Expense.find({ userId });
    console.log("Generating smart suggestions for user:", userId);
    const input = expenses.map((e) => ({
      amount: Number(e.amount),
      category: e.category,
      date: e.date.toISOString().split("T")[0],
    }));
    console.log("before calling python script");
    const py = spawn("python", ["utils/analyze_expenses.py"]);
    let data = "";
    console.log("after calling python script");

    py.stdin.write(JSON.stringify(input));
    py.stdin.end();

    py.stdout.on("data", (chunk) => {
      data += chunk.toString();
    });

    py.on("close", () => {
      try {
        const suggestions = JSON.parse(data);
        res.json(suggestions);
      } catch (err) {
        res.json({ message: "Failed to parse Python response" });
      }
    });
  } catch (err) {
    res.json({ message: err.message });
  }
};
