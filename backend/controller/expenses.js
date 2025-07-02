import Expense from "../models/expense.js";

export const addExpense = async (req, res) => {
  try {
    const { amount, category, date, payment, notes } = req.body;
    console.log("inside addExpense");
    const newExpense = new Expense({
      userId: req.user._id,
      amount,
      category,
      date,
      payment,
      notes,
    });
    
    await newExpense.save();
    console.log("inside addExpense 2");
    res.json(newExpense);
  } catch (error) {
    res.json({ message: "Failed to add expense", error: error.message });
  }
};

export const getExpenses = async (req, res) => {
  try {
    const { search, category, payment, date } = req.query;
    const filter = { userId: req.user._id };

    if (search) {
      filter.$or = [
        { notes: new RegExp(search, "i") },
        { category: new RegExp(search, "i") },
      ];
    }

    if (category) filter.category = category;
    if (payment) filter.payment = payment;
    if (date) {
      const d = new Date(date);
      const start = new Date(d.setHours(0, 0, 0));
      const end = new Date(d.setHours(23, 59, 59));
      filter.date = { $gte: start, $lte: end };
    }

    const expenses = await Expense.find(filter).sort({ date: -1 });
    res.status(200).json(expenses);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch expenses", error: error.message });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!expense) return res.status(404).json({ message: "Expense not found" });

    res.status(200).json({ message: "Expense deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete expense", error: error.message });
  }
};

export const updateExpense = async (req, res) => {
  try {
    const { amount, category, date, payment, notes } = req.body;
    console.log("inside updateExpense");
    const updatedExpense = await Expense.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { amount, category, date, payment, notes },
      { new: true }
    );

    if (!updatedExpense)
      return res.json({ message: "Expense not found" });

    res.json(updatedExpense);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update expense", error: error.message });
  }
};

