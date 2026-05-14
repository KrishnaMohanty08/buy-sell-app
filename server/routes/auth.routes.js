import express from "express"
import {register,login, getCurrentUser,requestOtp, verifyOtp } from "../controllers/authController.js";
import authMiddleWare from "../middleware/authMiddleware.js";
const { otpRequestLimiter, otpVerifyLimiter } = require('../middleware/rateLimiter');


const router=express.Router();
router.post("/register",register);
router.post("/login",login);
router.get("/user", authMiddleWare, getCurrentUser);
router.post("/request-otp", otpRequestLimiter, requestOtp);
router.post("/verify-otp", otpVerifyLimiter, verifyOtp);

export default router;