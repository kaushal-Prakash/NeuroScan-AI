import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      enum: ["onetime", "monthly", "weekly", "yearly"],
      required: true,
    },
    freeUsed: { type: Boolean, default: false },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date }, // only required for limited duration subs
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Create new model if not exists, otherwise use existing model
export default mongoose.models.Subscription ||
  mongoose.model("Subscription", subscriptionSchema);
