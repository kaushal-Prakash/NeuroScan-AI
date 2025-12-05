// scripts/resetFreeScans.js
import mongoose from "mongoose";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

async function resetFreeScans() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ Connected to MongoDB");
    
    const freeUsers = await User.find({ subscriptionType: "free" });
    let resetCount = 0;
    
    for (const user of freeUsers) {
      user.freeScansUsedThisWeek = 0;
      user.freeWeeklyResetDate = new Date();
      await user.save();
      resetCount++;
    }
    
    console.log(`✅ Reset free scans for ${resetCount} users`);
    
    // Also reset weekly scans for all users
    await User.updateMany(
      {},
      { 
        $set: { 
          weeklyScans: 0,
          weeklyResetDate: new Date()
        }
      }
    );
    
    console.log("✅ Reset weekly scan counters for all users");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Reset error:", error);
    process.exit(1);
  }
}

resetFreeScans();