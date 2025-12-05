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
      enum: ["free", "single", "weekly", "monthly", "yearly", "enterprise"],
      required: true,
    },
    freeUsed: { type: Boolean, default: false },
    onTimeFreemiumUsed: { type: Boolean, default: false }, // New field
    scansUsed: { type: Number, default: 0 },
    scansLimit: { type: Number },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date }, // only required for limited duration subs
    isActive: { type: Boolean, default: true },
    features: {
      priorityProcessing: { type: Boolean, default: false },
      detailedReports: { type: Boolean, default: false },
      apiAccess: { type: Boolean, default: false },
      bulkProcessing: { type: Boolean, default: false },
    }
  },
  { timestamps: true }
);

// Create new model if not exists, otherwise use existing model
export default mongoose.models.Subscription ||
  mongoose.model("Subscription", subscriptionSchema);