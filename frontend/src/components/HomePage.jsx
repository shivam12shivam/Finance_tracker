import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import DrawerAppBar from "./Navbar";
import { useDispatch } from "react-redux";
import { setExpenses } from "../redux/expenseSlice";
import { useForm } from "react-hook-form";

const categories = ["Food", "Rent", "Shopping", "Transport", "Other"];
const payments = ["UPI", "Credit Card", "Cash", "Netbanking"];

export default function HomePage() {
  const dispatch = useDispatch();
  const [suggestions, setSuggestions] = useState([]);
  const [expenses, SetExpense] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState({
    search: "",
    category: "",
    payment: "",
    date: "",
  });
  const [limits, setLimits] = useState([]);
  const [limitForm, setLimitForm] = useState({ category: "", amount: "" });
  const currentMonth = new Date().toISOString().slice(0, 7);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  const categoryTotals = expenses.reduce((acc, exp) => {
    const key = exp.category;
    acc[key] = (acc[key] || 0) + Number(exp.amount);
    return acc;
  }, {});

  const fetchLimits = async () => {
    const res = await axios.get("http://localhost:3000/limits", {
      params: { month: currentMonth },
      withCredentials: true,
    });
    setLimits(res.data);
  };

  const handleSetLimit = async () => {
    await axios.post(
      "http://localhost:3000/limits",
      { ...limitForm, month: currentMonth },
      { withCredentials: true }
    );
    setLimitForm({ category: "", amount: "" });
    fetchLimits();
  };

  const fetchSuggestions = async () => {
    try {
      const res = await axios.get("http://localhost:3000/suggestions", {
        withCredentials: true,
      });
      if (Array.isArray(res.data)) {
        setSuggestions(res.data);
      } else {
        setSuggestions([]);
      }
    } catch (err) {
      setSuggestions([]);
    }
  };

  const fetchExpenses = async () => {
    const res = await axios.get("http://localhost:3000/expenses", {
      params: filter,
      withCredentials: true,
    });
    SetExpense(res.data);
    dispatch(setExpenses(res.data));
  };

  useEffect(() => {
    fetchSuggestions();
    fetchExpenses();
    fetchLimits();
  }, []);

  const openAddDialog = () => {
    reset({ amount: "", category: "", date: "", payment: "", notes: "" });
    setEditingId(null);
    setDialogOpen(true);
  };

  const openEditDialog = (expense) => {
    reset(expense);
    setEditingId(expense._id);
    setDialogOpen(true);
  };

  const onSubmit = async (data) => {
    try {
      if (editingId) {
        await axios.put(
          `http://localhost:3000/expenses/${editingId}`,
          data,
          { withCredentials: true }
        );
      } else {
        await axios.post("http://localhost:3000/expenses/add", data, {
          withCredentials: true,
        });
      }
      setDialogOpen(false);
      fetchExpenses();
    } catch (err) {
      console.error("Submission error:", err);
    }
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:3000/expenses/${id}`, {
      withCredentials: true,
    });
    fetchExpenses();
  };

  const handleFilterChange = (key, value) => {
    setFilter((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    fetchExpenses();
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <DrawerAppBar />

  
      <div className="mb-4 bg-[#d8bdb49e] p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Monthly Limits</h2>
        <div className="flex flex-wrap items-center gap-4">
          <TextField
            label="Category"
            select
            size="small"
            className="w-42"
            value={limitForm.category}
            onChange={(e) =>
              setLimitForm({ ...limitForm, category: e.target.value })
            }
          >
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Amount"
            type="number"
            size="small"
            value={limitForm.amount}
            onChange={(e) =>
              setLimitForm({ ...limitForm, amount: e.target.value })
            }
          />
          <Button variant="contained" onClick={handleSetLimit}>
            Set Limit
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={async () => {
              const res = await axios.post(
                "http://localhost:3000/summary/save",
                {},
                { withCredentials: true }
              );
              alert(res.data.message);
            }}
          >
            Save Summary
          </Button>
        </div>

        <div className="bg-[#FCE6E6] p-4 rounded shadow mt-6">
          <h2 className="text-lg font-semibold mb-2">Smart Suggestions</h2>
          {Array.isArray(suggestions) && suggestions.length > 0 ? (
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              {suggestions.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No suggestions yet.</p>
          )}
        </div>

        <div className="mt-4 space-y-2">
          {limits.map((lim) => {
            const spent = categoryTotals[lim.category] || 0;
            const percent = ((spent / lim.amount) * 100).toFixed(0);
            return (
              <div
                key={lim.category}
                className="flex justify-between items-center text-sm"
              >
                <div>
                  <span className="font-medium">
                    <span className="font-bold">{lim.category}</span>:
                  </span>{" "}
                  ₹{spent} spent of ₹{lim.amount} limit
                </div>
                {percent >= 100 ? (
                  <span className="text-red-600 font-semibold">
                    Over Limit!
                  </span>
                ) : percent >= 80 ? (
                  <span className="text-yellow-600">⚠ {percent}% used</span>
                ) : (
                  <span className="text-green-600">{percent}% used</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Heading + Add Button */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Expenses</h1>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            openAddDialog();
          }}
        >
          Add Expense
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4">
        <TextField
          label="Search Amount"
          size="small"
          value={filter.search}
          onChange={(e) => handleFilterChange("search", e.target.value)}
        />
        <TextField
          label="Category"
          size="small"
          select
          value={filter.category}
          onChange={(e) => handleFilterChange("category", e.target.value)}
        >
          <MenuItem value="">All</MenuItem>
          {categories.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Payment"
          size="small"
          select
          value={filter.payment}
          onChange={(e) => handleFilterChange("payment", e.target.value)}
        >
          <MenuItem value="">All</MenuItem>
          {payments.map((pay) => (
            <MenuItem key={pay} value={pay}>
              {pay}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Date"
          type="date"
          size="small"
          InputLabelProps={{ shrink: true }}
          value={filter.date}
          onChange={(e) => handleFilterChange("date", e.target.value)}
        />
        <Button variant="outlined" onClick={applyFilters}>
          Apply
        </Button>
      </div>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {["Amount", "Category", "Date", "Payment", "Notes", "Actions"].map((head) => (
                <TableCell key={head} className="font-bold bg-[#FCE6E6]">
                  {head}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {expenses.map((exp) => (
              <TableRow key={exp._id} className="hover:bg-gray-200 bg-[#d8bdb49e]">
                <TableCell>₹{exp.amount}</TableCell>
                <TableCell>{exp.category}</TableCell>
                <TableCell>{new Date(exp.date).toLocaleDateString()}</TableCell>
                <TableCell>{exp.payment}</TableCell>
                <TableCell>{exp.notes}</TableCell>
                <TableCell>
                  <IconButton onClick={() => openEditDialog(exp)}>
                    <Edit className="text-emerald-400" />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(exp._id)}>
                    <Delete className="text-red-600" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>{editingId ? "Edit Expense" : "Add Expense"}</DialogTitle>
          <DialogContent className="!flex !flex-col gap-4">
            <TextField
              label="Amount (Required)"
              type="number"
              {...register("amount", { required: "Amount is required" })}
              fullWidth
              error={!!errors.amount}
              helperText={errors.amount?.message}
            />
            <TextField
              label="Category (Required)"
              select
              {...register("category", { required: "Category is required" })}
              fullWidth
              error={!!errors.category}
              helperText={errors.category?.message}
            >
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Date (Required)"
              type="date"
              InputLabelProps={{ shrink: true }}
              {...register("date", { required: "Date is required" })}
              fullWidth
              error={!!errors.date}
              helperText={errors.date?.message}
            />
            <TextField
              label="Payment Method (Required)"
              select
              {...register("payment", { required: "Payment method is required" })}
              fullWidth
              error={!!errors.payment}
              helperText={errors.payment?.message}
            >
              {payments.map((pay) => (
                <MenuItem key={pay} value={pay}>
                  {pay}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Notes (Optional)"
              {...register("notes")}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button variant="contained" type="submit">
              {editingId ? "Update" : "Add"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}
