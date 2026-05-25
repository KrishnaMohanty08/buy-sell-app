import asyncHandler from "../utils/asyncHandler.js";
import {
  validateRegister,
  validateLogin,
  validateOtpRequest,
  validateOtpVerification,
} from "../validation/schemas.js";
import * as authService from "../services/auth.service.js";

/**
 * Register new user
 * POST /api/auth/register
 */
export const register = asyncHandler(async (req, res) => {
  validateRegister(req.body);
  const result = await authService.registerUser(req.body);
  res.status(201).json(result);
});

/**
 * Login user
 * POST /api/auth/login
 */
export const login = asyncHandler(async (req, res) => {
  validateLogin(req.body);
  const { email, password } = req.body;
  const result = await authService.loginUser(email, password);
  res.status(200).json(result);
});

/**
 * Get current user profile
 * GET /api/auth/user
 * Requires: Authorization header with Bearer token
 */
export const getCurrentUser = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const user = await authService.getUserProfile(userId);
  res.status(200).json(user);
});

/**
 * Request OTP for password reset
 * POST /api/auth/request-otp
 * Rate limited via middleware
 */
export const requestOtp = asyncHandler(async (req, res) => {
  validateOtpRequest(req.body);
  const { email } = req.body;
  const result = await authService.requestPasswordReset(email);
  res.status(200).json(result);
});

/**
 * Verify OTP and authenticate
 * POST /api/auth/verify-otp
 * Rate limited via middleware
 */
export const verifyOtp = asyncHandler(async (req, res) => {
  validateOtpVerification(req.body);
  const { email, otp } = req.body;
  const result = await authService.verifyPasswordResetOtp(email, otp);
  res.status(200).json(result);
});

