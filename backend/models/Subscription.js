// models/Subscription.js
import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true,
      enum: ["Free", "Single Scan", "Weekly", "Monthly", "Yearly", "Enterprise"]
    },
    price: { type: Number, required: true },
    scansLimit: { type: Number, required: true },
    period: { 
      type: String,
      enum: ["single", "weekly", "monthly", "yearly", "lifetime"],
      required: true 
    },
    features: [{
      name: String,
      included: Boolean
    }],
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.models.Subscription || mongoose.model("Subscription", subscriptionSchema);