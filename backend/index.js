import mongoose from "mongoose";
import dotenv from "dotenv";
import express from "express";
import authRoutes from "./routes/auth.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import expenseRoutes from "./routes/expense.js";
import limitRoutes from "./routes/limit.js";
import summaryRoutes from "./routes/summary.js";
import { initMySQLTables } from "./models/summary.js";
import suggestionRoutes from "./routes/suggestion.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173", // Adjust this to your frontend URL
    credentials: true, // Allow cookies to be sent with requests
  })
);
console.log("insde backend index.js");
await initMySQLTables();

app.use("/summary", summaryRoutes);
app.use("/auth", authRoutes);
app.use("/expenses", expenseRoutes);
app.use("/limits", limitRoutes);
app.use("/suggestions", suggestionRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
