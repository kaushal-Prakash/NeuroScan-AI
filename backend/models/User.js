import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isPremium: { type: Boolean, default: false },
    subscriptionId: { type: String, default: null },
    subscriptionType: { 
      type: String, 
      enum: ["free", "single", "weekly", "monthly", "yearly", "enterprise"], 
      default: "free" 
    },
    subscriptionStartDate: { type: Date },
    subscriptionEndDate: { type: Date },
    scansUsed: { type: Number, default: 0 },
    scansLimit: { 
      type: Number, 
      default: 1 // Free users get 1 scan
    },
    freeScanUsed: { type: Boolean, default: false },
    role: { 
      type: String, 
      enum: ["patient", "doctor", "researcher", "admin"], 
      default: "patient" 
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);