import Limit from "../models/Limit.js";
export const setLimit = async (req, res) => {
  try {
    const { category, amount, month } = req.body;

    let limit = await Limit.findOne({ userId: req.user._id, category, month });

    if (limit) {
      limit.amount = amount;
      await limit.save();
      res.json({ message: "Budget updated", limit });
    } else {
      limit = new Limit({
        userId: req.user._id,
        category,
        amount,
        month,
      });
      await limit.save();
      res.json({ message: "Budget created", limit });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error setting limit", error: error.message });
  }
};

export const getLimits = async (req, res) => {
  try {
    const month = req.query.month;
    const limits = await Limit.find({ userId: req.user._id, month });
    res.json(limits);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error getting limits", error: error.message });
  }
};
