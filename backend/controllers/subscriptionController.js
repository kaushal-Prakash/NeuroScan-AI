// controllers/subscriptionController.js
import User from "../models/User.js";
import Payment from "../models/Payment.js";
import Subscription from "../models/Subscription.js";

// Check if user can perform a scan
const checkScanEligibility = async (userId) => {
  try {
    const user = await User.findById(userId);
    
    if (!user) {
      return { eligible: false, reason: "User not found" };
    }
    
    // Premium users have unlimited scans
    if (user.isPremium) {
      return { 
        eligible: true, 
        message: "Premium user - unlimited scans",
        userType: "premium",
        scansRemaining: -1 // -1 indicates unlimited
      };
    }
    
    // Check free scan usage
    if (user.subscriptionType === "free") {
      if (user.freeScanUsed) {
        return { 
          eligible: false, 
          reason: "Free scan already used. Please upgrade to continue.",
          upgradeRequired: true,
          scansRemaining: 0
        };
      }
      
      return { 
        eligible: true, 
        message: "Free scan available",
        userType: "free",
        scansRemaining: 1
      };
    }
    
    // Check paid subscription limits
    if (user.subscriptionType === "single") {
      if (user.scansUsed >= user.scansLimit) {
        return { 
          eligible: false, 
          reason: "Single scan subscription limit reached",
          upgradeRequired: true,
          scansRemaining: 0
        };
      }
      
      return { 
        eligible: true,
        message: "Single scan subscription",
        userType: "single",
        scansRemaining: user.scansLimit - user.scansUsed
      };
    }
    
    // Check time-based subscriptions
    if (["weekly", "monthly", "yearly"].includes(user.subscriptionType)) {
      // Check if subscription is still valid
      if (user.subscriptionEndDate && new Date() > user.subscriptionEndDate) {
        return { 
          eligible: false, 
          reason: "Subscription expired",
          upgradeRequired: true,
          scansRemaining: 0
        };
      }
      
      // Check scan limit
      if (user.scansUsed >= user.scansLimit) {
        return { 
          eligible: false, 
          reason: "Scan limit reached for current period",
          upgradeRequired: true,
          scansRemaining: 0
        };
      }
      
      return { 
        eligible: true,
        message: "Active subscription",
        userType: user.subscriptionType,
        scansRemaining: user.scansLimit - user.scansUsed
      };
    }
    
    // Default fallback
    return { eligible: false, reason: "Unknown subscription status" };
    
  } catch (error) {
    console.error("Error checking scan eligibility:", error);
    return { eligible: false, reason: "Server error" };
  }
};

// Record scan usage
const recordScanUsage = async (userId) => {
  try {
    const user = await User.findById(userId);
    
    if (!user) {
      return { success: false, error: "User not found" };
    }
    
    // Increment scans used
    user.scansUsed += 1;
    
    // Mark free scan as used
    if (user.subscriptionType === "free" && !user.freeScanUsed) {
      user.freeScanUsed = true;
    }
    
    await user.save();
    
    return { 
      success: true, 
      scansUsed: user.scansUsed,
      scansLimit: user.scansLimit,
      scansRemaining: user.scansLimit - user.scansUsed
    };
    
  } catch (error) {
    console.error("Error recording scan usage:", error);
    return { success: false, error: error.message };
  }
};

// Get subscription plans
const getSubscriptionPlans = async (req, res) => {
  try {
    const plans = await Subscription.find({ isActive: true }).sort({ price: 1 });
    
    res.status(200).json({
      success: true,
      plans: plans.map(plan => ({
        id: plan._id,
        name: plan.name,
        price: plan.price,
        period: plan.period,
        scansLimit: plan.scansLimit,
        features: plan.features
      }))
    });
  } catch (error) {
    console.error("Error getting subscription plans:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Process payment (simplified for demo)
const processPayment = async (req, res) => {
  try {
    const { subscriptionType, paymentMethod } = req.body;
    const userId = req.user._id;
    
    // Get subscription plan details
    const plan = await Subscription.findOne({ period: subscriptionType });
    if (!plan) {
      return res.status(400).json({ success: false, error: "Invalid subscription type" });
    }
    
    // In a real app, integrate with payment gateway (Stripe, PayPal, etc.)
    // For demo, we'll simulate successful payment
    
    const user = await User.findById(userId);
    
    // Update user subscription
    user.subscriptionType = subscriptionType;
    user.isPremium = subscriptionType === "enterprise" || subscriptionType === "yearly";
    user.scansLimit = plan.scansLimit;
    user.scansUsed = 0;
    user.freeScanUsed = false;
    user.subscriptionStartDate = new Date();
    
    // Calculate end date for time-based subscriptions
    if (subscriptionType === "weekly") {
      user.subscriptionEndDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    } else if (subscriptionType === "monthly") {
      user.subscriptionEndDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    } else if (subscriptionType === "yearly") {
      user.subscriptionEndDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
    }
    
    await user.save();
    
    // Record payment
    const payment = new Payment({
      userId,
      subscriptionType,
      amount: plan.price,
      status: "completed",
      paymentMethod: paymentMethod || "demo",
      transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      expiresAt: user.subscriptionEndDate
    });
    
    await payment.save();
    
    res.status(200).json({
      success: true,
      message: "Payment processed successfully",
      subscription: {
        type: subscriptionType,
        startDate: user.subscriptionStartDate,
        endDate: user.subscriptionEndDate,
        scansLimit: plan.scansLimit,
        price: plan.price
      },
      user: {
        isPremium: user.isPremium,
        scansUsed: user.scansUsed,
        scansRemaining: user.scansLimit - user.scansUsed
      }
    });
    
  } catch (error) {
    console.error("Error processing payment:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get user subscription status
const getUserSubscription = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }
    
    const eligibility = await checkScanEligibility(userId);
    
    res.status(200).json({
      success: true,
      subscription: {
        type: user.subscriptionType,
        isPremium: user.isPremium,
        scansUsed: user.scansUsed,
        scansLimit: user.scansLimit,
        scansRemaining: user.scansLimit - user.scansUsed,
        freeScanUsed: user.freeScanUsed,
        subscriptionStartDate: user.subscriptionStartDate,
        subscriptionEndDate: user.subscriptionEndDate,
        eligible: eligibility.eligible,
        message: eligibility.message,
        userType: eligibility.userType
      }
    });
    
  } catch (error) {
    console.error("Error getting user subscription:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export {
  checkScanEligibility,
  recordScanUsage,
  getSubscriptionPlans,
  processPayment,
  getUserSubscription
};