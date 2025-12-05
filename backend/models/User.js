// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    
    // Subscription tracking
    subscriptionType: { 
      type: String, 
      enum: ["free", "single", "weekly", "monthly", "yearly"], 
      default: "free" 
    },
    subscriptionPlanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription"
    },
    subscriptionStartDate: { type: Date },
    subscriptionEndDate: { type: Date },
    isActive: { type: Boolean, default: true },
    
    // Scan tracking with weekly reset
    totalScans: { type: Number, default: 0 },
    weeklyScans: { type: Number, default: 0 },
    weeklyResetDate: { type: Date, default: Date.now },
    
    // For free users: 3 scans per week
    freeScansUsedThisWeek: { type: Number, default: 0 },
    freeWeeklyResetDate: { type: Date, default: Date.now },
    
    // For single scan users
    singleScanUsed: { type: Boolean, default: false },
    
    // Timestamps
    createdAt: { type: Date, default: Date.now },
    lastActive: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Method to check if weekly reset is needed
userSchema.methods.checkWeeklyReset = function() {
  const now = new Date();
  const daysSinceReset = Math.floor((now - this.weeklyResetDate) / (1000 * 60 * 60 * 24));
  
  if (daysSinceReset >= 7) {
    this.weeklyScans = 0;
    this.weeklyResetDate = now;
    return true;
  }
  return false;
};

// Method to check free weekly reset
userSchema.methods.checkFreeWeeklyReset = function() {
  const now = new Date();
  const daysSinceReset = Math.floor((now - this.freeWeeklyResetDate) / (1000 * 60 * 60 * 24));
  
  if (daysSinceReset >= 7) {
    this.freeScansUsedThisWeek = 0;
    this.freeWeeklyResetDate = now;
    return true;
  }
  return false;
};

export default mongoose.models.User || mongoose.model("User", userSchema);