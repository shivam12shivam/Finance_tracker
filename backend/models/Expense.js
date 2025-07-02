import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  date: { type: Date },
  payment: { type: String, required: true },
  notes: { type: String },
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' }
}, { timestamps: true });

const Expense = mongoose.model('Expense', expenseSchema);
export default Expense;