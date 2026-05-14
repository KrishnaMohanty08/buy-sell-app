import express from "express"
import {register,login, getCurrentUser,requestOtp, verifyOtp } from "../controllers/authController.js";
import authMiddleWare from "../middleware/authMiddleware.js";
import { otpRequestLimiter, otpVerifyLimiter } from '../middleware/rateLimiter.js';


const router=express.Router();
router.post("/register",register);
router.post("/login",login);
router.get("/user", authMiddleWare, getCurrentUser);
router.post("/request-otp", otpRequestLimiter, requestOtp);
router.post("/verify-otp", otpVerifyLimiter, verifyOtp);

export default router;