import React, { useState } from "react";
import axios from "axios";
import DrawerAppBar from "./Navbar";
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const years = ["2024", "2025"];

export default function MonthlyReport() {
  const [selectedMonth, setSelectedMonth] = useState("January");
  const [selectedYear, setSelectedYear] = useState("2025");
  const [expenses, setExpenses] = useState({});

  const [total, setTotal] = useState(0);

  const getExpenses = async () => {
    try {
      const res = await axios.get("https://finance-tracker-bgrn.onrender.com/expenses/monthly", {
        params: {
          month: selectedMonth,
          year: selectedYear,
        },
        withCredentials: true,
      });
      setExpenses(res.data.categoryTotals);
      console.log(res.data);
      console.log(res.data.categoryTotals);

      setTotal(res.data.total);
    } catch (err) {
      console.error("Error fetching expenses:", err);
      setExpenses([]);
      setTotal(0);
    }
  };

  return (
    <div className="p-6">
      <DrawerAppBar />
      <h2 className="text-xl font-bold mb-4">Monthly Expense Report</h2>

      <div className="flex gap-4 mb-4">
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="border p-2 rounded"
        >
          {months.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="border p-2 rounded"
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

        <button
          onClick={getExpenses}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Get Expenses
        </button>
      </div>

      {Object.entries(expenses).length > 0 ? (
        <ul className="list-disc pl-6">
          {Object.entries(expenses).map(([category, amount]) => (
            <li key={category}>
              ₹{amount} spent on {category}
            </li>
          ))}
        </ul>
      ) : (
        <p>No expenses found for this period.</p>
      )}

      <p className="mt-4 font-semibold text-lg">Total Spent: ₹{total}</p>
    </div>
  );
}
