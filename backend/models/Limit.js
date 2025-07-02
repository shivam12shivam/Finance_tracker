import mongoose from "mongoose";

const limitSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  month: { type: String, required: true }, 
});

export default mongoose.model("Limit", limitSchema);
