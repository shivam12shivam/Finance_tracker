import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import expenseRoutes from "./routes/expense.js";
import limitRoutes from "./routes/limit.js";
import summaryRoutes from "./routes/summary.js";
import suggestionRoutes from "./routes/suggestion.js";
import { initPostgresTables } from "./models/summary.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "https://finance-tracker-gold-delta.vercel.app", // Adjust this to your frontend URL
    credentials: true, // Allow cookies to be sent with requests
  })
);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,PUT,POST,DELETE,UPDATE,OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
  );
  next();
});

console.log("insde backend index.js");
await initPostgresTables();

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
