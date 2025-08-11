import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true,
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
  },
  paymentId: {
    type: String,
    require: true,
  },
  orderId: {
    type: String,
    require: true,
  },
  amount: {
    type: Number,
    require: true,
  },
  status: {
    type: String,
    require: true,
    enum: ["pending", "success", "failed"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;
