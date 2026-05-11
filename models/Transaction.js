import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  value: { type: Number, required: true, min: 0 },
  type: { type: String, enum: ["entrada", "saida"], required: true },
  category: { type: String, required: true, trim: true },
  description: { type: String, default: "" },
  date: { type: Date, required: true },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
});

transactionSchema.index({ user: 1, date: -1 });

export default mongoose.models.Transaction || mongoose.model("Transaction", transactionSchema);
