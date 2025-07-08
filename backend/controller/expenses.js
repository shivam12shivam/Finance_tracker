import Expense from "../models/Expense.js";

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

export const monthlyexpenses = async (req, res) => {
  const { month, year } = req.query;

  const monthMap = {
    January: 0, February: 1, March: 2, April: 3, May: 4, June: 5,
    July: 6, August: 7, September: 8, October: 9, November: 10, December: 11,
  };
  
  const monthIndex = monthMap[month];
  

  const start = new Date(year, monthIndex, 1);
  const end = new Date(year, monthIndex + 1, 1);

  const expenses = await Expense.find({
    userId: req.user._id,
    date: { $gte: start, $lt: end },
  });

  // const ob=[];
  const categoryTotals = expenses.reduce((acc, exp) => {
    const key = exp.category;
    acc[key] = (acc[key] || 0) + Number(exp.amount);
    return acc;
    
  }, {});

  console.log(categoryTotals);
  const total = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
  console.log(total);
  res.json({ categoryTotals, total });
};

