// routes/subscriptionRoutes.js
import e from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  getSubscriptionPlans,
  processPayment,
  getUserSubscription
} from "../controllers/subscriptionController.js";

const router = e.Router();

// Public routes
router.get("/plans", getSubscriptionPlans);

// Protected routes
router.get("/status", authMiddleware, getUserSubscription);
router.post("/upgrade", authMiddleware, processPayment);

export default router;