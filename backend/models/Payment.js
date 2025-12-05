// models/Payment.js
import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subscriptionType: { 
      type: String,
    //   enum: ["single", "weekly", "monthly", "yearly", "enterprise"],
    //   required: true 
    },
    amount: { type: Number, required: true },
    currency: { type: String, default: "USD" },
    status: { 
      type: String, 
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending" 
    },
    paymentMethod: { type: String },
    transactionId: { type: String },
    paymentDate: { type: Date, default: Date.now },
    expiresAt: { type: Date }, // For limited duration subscriptions
  },
  { timestamps: true }
);

export default mongoose.models.Payment || mongoose.model("Payment", paymentSchema);