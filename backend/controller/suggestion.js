import OpenAI from "openai";
import Expense from "../models/Expense.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateSmartSuggestions = async (req, res) => {
  try {
    const userId = req.user._id;
    const expenses = await Expense.find({ userId });

    const formatted = expenses.map((e) => ({
      amount: Number(e.amount),
      category: e.category,
      date: e.date.toISOString().split("T")[0],
    }));

    const prompt = `
You are a smart finance assistant. Based on this user's expense data, suggest 3 ways they can save money this month.

Here are the expenses: ${JSON.stringify(formatted)}

Provide your response as a list of 3 short, actionable bullet points.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const suggestionsText = response.choices[0].message.content;
    const suggestions = suggestionsText.split("\n").filter((line) => line.trim());
    
    res.json(suggestions);
  } catch (err) {
    console.error("Error generating suggestions:", err.message);
    res.json([
      "Track recurring subscriptions and cancel unused ones.",
      "Reduce eating out expenses and cook more meals at home.",
      "Set a weekly cash spending limit and stick to it."
    ]);
  }
};
