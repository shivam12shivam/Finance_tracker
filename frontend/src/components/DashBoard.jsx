import React from "react";
import { useSelector } from "react-redux";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import DrawerAppBar from "./Navbar";
import { ResponsiveContainer } from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#00C49F"];

export default function Dashboard() {
  const expenses = useSelector((state) => state.expenses.data);

  const currentMonth = new Date().toISOString().slice(0, 7);
  const currentMonthExpenses = expenses.filter(
    (e) => e.date.slice(0, 7) === currentMonth
  );

  const totalSpent = currentMonthExpenses.reduce(
    (acc, curr) => acc + Number(curr.amount),
    0
  );

  const categorySpending = currentMonthExpenses.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + Number(curr.amount);
    return acc;
  }, {});

  const topCategory = Object.entries(categorySpending).sort(
    (a, b) => b[1] - a[1]
  )[0];

  const paymentStats = currentMonthExpenses.reduce((acc, curr) => {
    acc[curr.payment] = (acc[curr.payment] || 0) + 1;
    return acc;
  }, {});
  const topPayments = Object.entries(paymentStats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const pieData = Object.entries(categorySpending).map(([key, value]) => ({
    name: key,
    value,
  }));

  const dailySpending = currentMonthExpenses.reduce((acc, curr) => {
    const day = new Date(curr.date).toLocaleDateString();
    acc[day] = (acc[day] || 0) + Number(curr.amount);
    return acc;
  }, {});
  const lineData = Object.entries(dailySpending).map(([date, value]) => ({
    date,
    value,
  }));

  return (
    <div className="p-6 bg-gray-200 min-h-screen space-y-6">
      <DrawerAppBar />
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold text-lg">Total Spent (This Month)</h2>
          <p className="text-2xl font-bold text-blue-600">₹{totalSpent}</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold text-lg">Top Category</h2>
          <p className="text-xl">
            {topCategory ? `${topCategory[0]}: ₹${topCategory[1]}` : "N/A"}
          </p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold text-lg">Top Payment Methods</h2>
          {topPayments.map(([method, count]) => (
            <p key={method}>
              {method}: {count} times
            </p>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#FCE6E6]  p-4 rounded shadow h-[28rem]">
          <h2 className="text-lg font-semibold mb-4 text-center">
            Category-wise Spending
          </h2>
          <div className="h-[80%] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius="100" // Increased from 80%
                  label
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#d4b9af9e] p-4 rounded shadow h-[28rem]">
          <h2 className="text-lg font-semibold mb-2 text-center">
            Spending Over Time
          </h2>
          <div className="h-[80%] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={lineData}
                margin={{ top: 20, right: 30, left: 40, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#8884d8"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
