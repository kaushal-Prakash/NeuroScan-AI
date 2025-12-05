import e from 'express';
import { changeName, getUser, isAuthenticated, login, resetPassword, signout, signup } from '../controllers/authController.js';
import { createOtp, verifyOtp } from '../controllers/otpController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import passport from "../services/oauth.js";
import jwt from "jsonwebtoken";
const router = e.Router();

router.post("/signup", signup);
router.post("/login",login);
router.get("/signout",signout);
router.post("/change-name",authMiddleware,changeName)
router.post("/reset-password",resetPassword);
router.get("/create-otp",authMiddleware,createOtp);
router.post("/verify-otp",authMiddleware,verifyOtp);
router.get("/is-authenticated",authMiddleware, isAuthenticated);
router.get("/get-user",authMiddleware, getUser);

//oauth routes
router.get("/google",passport.authenticate("google",{scope:["profile","email"]}));
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login", session: false }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.redirect("http://localhost:3000/home");
  }
);



export default router;