// controllers/subscriptionController.js
import User from "../models/User.js";
import Payment from "../models/Payment.js";
import Subscription from "../models/Subscription.js";

// Check if user can perform a scan
const checkScanEligibility = async (userId) => {
  try {
    const user = await User.findById(userId);
    
    if (!user) {
      return { 
        eligible: false, 
        reason: "User not found",
        code: "USER_NOT_FOUND"
      };
    }
    
    // Check weekly reset for all users
    user.checkWeeklyReset();
    
    // FREE USERS: 3 scans per week
    if (user.subscriptionType === "free") {
      user.checkFreeWeeklyReset();
      await user.save();
      
      if (user.freeScansUsedThisWeek >= 3) {
        return { 
          eligible: false, 
          reason: "Free limit reached (3 scans/week). Upgrade for more scans.",
          code: "FREE_LIMIT_REACHED",
          scansUsed: user.freeScansUsedThisWeek,
          limit: 3,
          period: "week",
          upgradeRequired: true
        };
      }
      
      return { 
        eligible: true, 
        message: "Free user - 3 scans per week",
        userType: "free",
        scansUsed: user.freeScansUsedThisWeek,
        scansRemaining: 3 - user.freeScansUsedThisWeek,
        period: "week"
      };
    }
    
    // SINGLE SCAN: One-time use
    if (user.subscriptionType === "single") {
      if (user.singleScanUsed) {
        return { 
          eligible: false, 
          reason: "Single scan already used. Please purchase another scan or upgrade.",
          code: "SINGLE_SCAN_USED",
          upgradeRequired: true
        };
      }
      
      return { 
        eligible: true,
        message: "Single scan subscription",
        userType: "single",
        scansUsed: user.singleScanUsed ? 1 : 0,
        scansRemaining: user.singleScanUsed ? 0 : 1
      };
    }
    
    // WEEKLY ACCESS: Unlimited scans for 7 days
    if (user.subscriptionType === "weekly") {
      // Check if subscription is still valid
      if (user.subscriptionEndDate && new Date() > user.subscriptionEndDate) {
        return { 
          eligible: false, 
          reason: "Weekly subscription expired. Please renew.",
          code: "SUBSCRIPTION_EXPIRED",
          upgradeRequired: true
        };
      }
      
      return { 
        eligible: true,
        message: "Weekly subscription - unlimited scans",
        userType: "weekly",
        scansUsed: user.weeklyScans,
        scansRemaining: -1, // -1 means unlimited
        subscriptionEnds: user.subscriptionEndDate
      };
    }
    
    // MONTHLY PRO: Unlimited scans for 30 days
    if (user.subscriptionType === "monthly") {
      // Check if subscription is still valid
      if (user.subscriptionEndDate && new Date() > user.subscriptionEndDate) {
        return { 
          eligible: false, 
          reason: "Monthly subscription expired. Please renew.",
          code: "SUBSCRIPTION_EXPIRED",
          upgradeRequired: true
        };
      }
      
      return { 
        eligible: true,
        message: "Monthly subscription - unlimited scans",
        userType: "monthly",
        scansUsed: user.weeklyScans,
        scansRemaining: -1, // -1 means unlimited
        subscriptionEnds: user.subscriptionEndDate
      };
    }
    
    // ENTERPRISE/YEARLY: Unlimited scans for 365 days
    if (user.subscriptionType === "yearly") {
      // Check if subscription is still valid
      if (user.subscriptionEndDate && new Date() > user.subscriptionEndDate) {
        return { 
          eligible: false, 
          reason: "Yearly subscription expired. Please renew.",
          code: "SUBSCRIPTION_EXPIRED",
          upgradeRequired: true
        };
      }
      
      return { 
        eligible: true,
        message: "Yearly subscription - unlimited scans",
        userType: "yearly",
        scansUsed: user.weeklyScans,
        scansRemaining: -1, // -1 means unlimited
        subscriptionEnds: user.subscriptionEndDate
      };
    }
    
    // Default fallback
    return { 
      eligible: false, 
      reason: "Unknown subscription type",
      code: "UNKNOWN_SUBSCRIPTION"
    };
    
  } catch (error) {
    console.error("Error checking scan eligibility:", error);
    return { 
      eligible: false, 
      reason: "Server error checking eligibility",
      code: "SERVER_ERROR" 
    };
  }
};

// Record scan usage
const recordScanUsage = async (userId) => {
  try {
    const user = await User.findById(userId);
    
    if (!user) {
      return { success: false, error: "User not found" };
    }
    
    // Update counters based on subscription type
    user.totalScans += 1;
    user.weeklyScans += 1;
    user.lastActive = new Date();
    
    if (user.subscriptionType === "free") {
      user.freeScansUsedThisWeek += 1;
    } else if (user.subscriptionType === "single") {
      user.singleScanUsed = true;
    }
    
    await user.save();
    
    // Get updated eligibility
    const eligibility = await checkScanEligibility(userId);
    
    return { 
      success: true, 
      totalScans: user.totalScans,
      weeklyScans: user.weeklyScans,
      eligibility: eligibility
    };
    
  } catch (error) {
    console.error("Error recording scan usage:", error);
    return { success: false, error: error.message };
  }
};

// Initialize subscription plans
const initializePlans = async () => {
  const plans = [
    {
      name: "Free",
      price: 0,
      period: "single",
      scansPerPeriod: 3,
      description: "3 free scans per week",
      features: [
        { name: "3 MRI Scans per week", included: true, description: "Weekly limit resets every Monday" },
        { name: "Basic Tumor Detection", included: true, description: "Standard AI analysis" },
        { name: "PDF Report", included: true, description: "Basic medical report" },
        { name: "Email Support", included: true, description: "24-48 hour response" },
        { name: "Priority Processing", included: false, description: "Standard queue" },
        { name: "Advanced Analytics", included: false, description: "Basic only" },
        { name: "API Access", included: false, description: "Not available" }
      ]
    },
    {
      name: "Single Scan",
      price: 4.99,
      period: "single",
      scansPerPeriod: 1,
      description: "Get one comprehensive brain MRI analysis report.",
      features: [
        { name: "One-time MRI analysis", included: true, description: "Single use only" },
        { name: "Detailed tumor classification", included: true, description: "Full analysis report" },
        { name: "PDF medical report", included: true, description: "Downloadable report" },
        { name: "Basic visualization", included: true, description: "Image preview" },
        { name: "Email support", included: true, description: "Priority email support" },
        { name: "Priority Processing", included: false, description: "Standard queue" },
        { name: "Unlimited Scans", included: false, description: "Single scan only" }
      ]
    },
    {
      name: "Weekly Access",
      price: 14.99,
      period: "weekly",
      scansPerPeriod: 0, // 0 means unlimited
      description: "Unlimited scans for 7 days. Ideal for patient monitoring.",
      features: [
        { name: "Unlimited MRI analyses", included: true, description: "No limits for 7 days" },
        { name: "Advanced tumor detection", included: true, description: "Enhanced AI models" },
        { name: "Comparative reports", included: true, description: "Compare multiple scans" },
        { name: "Priority processing", included: true, description: "Faster results" },
        { name: "Email & chat support", included: true, description: "Multi-channel support" },
        { name: "Scan History", included: true, description: "7-day history" },
        { name: "API Access", included: false, description: "Not available" }
      ]
    },
    {
      name: "Monthly Pro",
      price: 39.99,
      period: "monthly",
      scansPerPeriod: 0, // 0 means unlimited
      description: "For medical professionals & small clinics. Best value.",
      isPopular: true,
      features: [
        { name: "Unlimited scans", included: true, description: "No monthly limits" },
        { name: "Multi-patient management", included: true, description: "Manage multiple patients" },
        { name: "Advanced analytics", included: true, description: "Detailed insights" },
        { name: "2-hour processing", included: true, description: "Guanteed fast results" },
        { name: "Priority phone support", included: true, description: "Direct phone support" },
        { name: "HIPAA compliant", included: true, description: "Medical data security" },
        { name: "Basic API Access", included: true, description: "Limited API access" }
      ]
    },
    {
      name: "Enterprise",
      price: 299.99,
      period: "yearly",
      scansPerPeriod: 0, // 0 means unlimited
      description: "For hospitals & research institutions. Full platform access.",
      isBestValue: true,
      features: [
        { name: "All Pro features", included: true, description: "Everything in Monthly Pro" },
        { name: "Custom AI models", included: true, description: "Tailored to your needs" },
        { name: "API integration", included: true, description: "Full API access" },
        { name: "1-hour processing", included: true, description: "Ultra-fast results" },
        { name: "24/7 dedicated support", included: true, description: "Round-the-clock support" },
        { name: "Bulk processing", included: true, description: "Process multiple scans" },
        { name: "Research collaboration", included: true, description: "Work with our team" }
      ]
    }
  ];

  try {
    // Clear existing plans
    await Subscription.deleteMany({});
    
    // Insert new plans
    for (const plan of plans) {
      const newPlan = new Subscription(plan);
      await newPlan.save();
      console.log(`✅ Added plan: ${plan.name}`);
    }
    
    console.log("✅ Subscription plans initialized successfully!");
    return { success: true, message: "Plans initialized" };
  } catch (error) {
    console.error("❌ Error initializing plans:", error);
    return { success: false, error: error.message };
  }
};

// Get subscription plans
const getSubscriptionPlans = async (req, res) => {
  try {
    const plans = await Subscription.find({ isActive: true }).sort({ price: 1 });
    
    // If no plans exist, initialize them
    if (plans.length === 0) {
      await initializePlans();
      const newPlans = await Subscription.find({ isActive: true }).sort({ price: 1 });
      return res.status(200).json({
        success: true,
        plans: newPlans,
        initialized: true
      });
    }
    
    res.status(200).json({
      success: true,
      plans: plans,
      initialized: false
    });
  } catch (error) {
    console.error("Error getting subscription plans:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Process subscription upgrade
const processSubscriptionUpgrade = async (req, res) => {
  try {
    const { planId, paymentMethod = "demo" } = req.body;
    const userId = req.user._id;
    
    // Get the selected plan
    const plan = await Subscription.findById(planId);
    if (!plan) {
      return res.status(400).json({ 
        success: false, 
        error: "Invalid subscription plan" 
      });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: "User not found" 
      });
    }
    
    // Calculate subscription end date based on period
    const now = new Date();
    let subscriptionEndDate = null;
    
    switch (plan.period) {
      case "single":
        subscriptionEndDate = null; // One-time, never expires (but single use)
        break;
      case "weekly":
        subscriptionEndDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        break;
      case "monthly":
        subscriptionEndDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        break;
      case "yearly":
        subscriptionEndDate = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
        break;
    }
    
    // Update user subscription
    user.subscriptionType = plan.period;
    user.subscriptionPlanId = plan._id;
    user.subscriptionStartDate = now;
    user.subscriptionEndDate = subscriptionEndDate;
    user.isActive = true;
    
    // Reset scan counters for new subscription
    if (plan.period !== "free") {
      user.freeScansUsedThisWeek = 0;
      user.singleScanUsed = false;
    }
    
    await user.save();
    
    // Record payment (simulated for demo)
    if (plan.price > 0) {
      const payment = new Payment({
        userId,
        subscriptionType: plan.period,
        planName: plan.name,
        amount: plan.price,
        currency: "USD",
        status: "completed",
        paymentMethod,
        transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        paymentDate: now,
        expiresAt: subscriptionEndDate
      });
      
      await payment.save();
    }
    
    // Get updated eligibility
    const eligibility = await checkScanEligibility(userId);
    
    res.status(200).json({
      success: true,
      message: `Successfully upgraded to ${plan.name}`,
      subscription: {
        plan: plan.name,
        type: plan.period,
        price: plan.price,
        startDate: user.subscriptionStartDate,
        endDate: user.subscriptionEndDate,
        features: plan.features.filter(f => f.included).map(f => f.name)
      },
      user: {
        subscriptionType: user.subscriptionType,
        totalScans: user.totalScans,
        weeklyScans: user.weeklyScans,
        freeScansUsedThisWeek: user.freeScansUsedThisWeek
      },
      eligibility: eligibility
    });
    
  } catch (error) {
    console.error("Error processing subscription upgrade:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get user subscription status
const getUserSubscription = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).populate("subscriptionPlanId");
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: "User not found" 
      });
    }
    
    // Check eligibility
    const eligibility = await checkScanEligibility(userId);
    
    // Calculate days remaining for paid subscriptions
    let daysRemaining = null;
    if (user.subscriptionEndDate) {
      const now = new Date();
      const timeDiff = user.subscriptionEndDate - now;
      daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    }
    
    // Calculate next free reset
    const nextFreeReset = new Date(user.freeWeeklyResetDate);
    nextFreeReset.setDate(nextFreeReset.getDate() + 7);
    const daysUntilFreeReset = Math.ceil((nextFreeReset - new Date()) / (1000 * 60 * 60 * 24));
    
    res.status(200).json({
      success: true,
      subscription: {
        type: user.subscriptionType,
        plan: user.subscriptionPlanId,
        startDate: user.subscriptionStartDate,
        endDate: user.subscriptionEndDate,
        daysRemaining: daysRemaining,
        isActive: user.isActive
      },
      usage: {
        totalScans: user.totalScans,
        weeklyScans: user.weeklyScans,
        freeScansUsedThisWeek: user.freeScansUsedThisWeek,
        freeScansRemaining: 3 - user.freeScansUsedThisWeek,
        nextFreeReset: nextFreeReset,
        daysUntilFreeReset: daysUntilFreeReset,
        singleScanUsed: user.singleScanUsed
      },
      eligibility: eligibility
    });
    
  } catch (error) {
    console.error("Error getting user subscription:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Reset free weekly scans (admin function)
const resetFreeWeeklyScans = async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      // Reset for all free users
      const freeUsers = await User.find({ subscriptionType: "free" });
      let resetCount = 0;
      
      for (const user of freeUsers) {
        user.freeScansUsedThisWeek = 0;
        user.freeWeeklyResetDate = new Date();
        await user.save();
        resetCount++;
      }
      
      return res.status(200).json({
        success: true,
        message: `Reset free scans for ${resetCount} users`,
        resetCount
      });
    }
    
    // Reset for specific user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: "User not found" 
      });
    }
    
    user.freeScansUsedThisWeek = 0;
    user.freeWeeklyResetDate = new Date();
    await user.save();
    
    res.status(200).json({
      success: true,
      message: "Free scans reset for user",
      user: {
        id: user._id,
        email: user.email,
        freeScansUsedThisWeek: user.freeScansUsedThisWeek,
        freeWeeklyResetDate: user.freeWeeklyResetDate
      }
    });
    
  } catch (error) {
    console.error("Error resetting free weekly scans:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const processPayment = async (req, res) => {
  try {
    const { amount, currency = "USD", paymentMethod = "demo", description, metadata } = req.body;
    const userId = req.user._id;
    
    // Demo payment processing
    const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const payment = new Payment({
      userId,
      amount,
      currency,
      description: description || "Payment",
      status: "completed",
      paymentMethod,
      transactionId,
      paymentDate: new Date(),
      metadata: metadata || {}
    });
    
    await payment.save();
    
    res.status(200).json({
      success: true,
      message: "Payment processed successfully",
      payment: {
        id: payment._id,
        transactionId,
        amount,
        currency,
        status: "completed",
        paymentDate: payment.paymentDate
      }
    });
    
  } catch (error) {
    console.error("Error processing payment:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export {
  checkScanEligibility,
  recordScanUsage,
  getSubscriptionPlans,
  processSubscriptionUpgrade,
  getUserSubscription,
  resetFreeWeeklyScans,
  initializePlans,
  processPayment
};