import e from "express";
import { createOtp, verifyOtp } from "../controllers/otpController.js";
const router = e.Router();

router.post("/create-otp", createOtp);
router.post("/verify-otp", verifyOtp);

export default router;