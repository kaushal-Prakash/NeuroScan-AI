// scripts/initSubscriptionSystem.js
import mongoose from "mongoose";
import { initializePlans } from "../controllers/subscriptionController.js";
import dotenv from "dotenv";

dotenv.config();

async function initializeSystem() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ Connected to MongoDB");
    
    // Initialize subscription plans
    const result = await initializePlans();
    
    if (result.success) {
      console.log("✅ Subscription system initialized successfully!");
    } else {
      console.error("❌ Failed to initialize subscription system:", result.error);
    }
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Initialization error:", error);
    process.exit(1);
  }
}

initializeSystem();