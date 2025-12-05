// models/Subscription.js
import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true,
      enum: ["Free", "Single Scan", "Weekly Access", "Monthly Pro", "Enterprise"]
    },
    price: { type: Number, required: true },
    period: { 
      type: String,
      enum: ["single", "weekly", "monthly", "yearly"],
      required: true 
    },
    scansPerPeriod: { 
      type: Number, 
      required: true,
      default: 0 // 0 means unlimited, positive number means limited
    },
    features: [{
      name: String,
      included: Boolean,
      description: String
    }],
    description: { type: String },
    isPopular: { type: Boolean, default: false },
    isBestValue: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.models.Subscription || mongoose.model("Subscription", subscriptionSchema);