/**
 * Authentication Service
 * Handles user registration, login, and profile retrieval
 * Separates business logic from HTTP controllers
 */

import bcrypt from "bcryptjs";
import prisma from "../prisma/client.js";
import generateToken from "../utils/jwt.js";
import { generateOtp, getOtpExpiry } from "../utils/otp.js";
import { sendOtpEmail } from "../utils/mailer.js";
import AppError from "../utils/AppError.js";
import { createAuthResponse, createUserProfileResponse } from "../utils/dtos.js";

/**
 * Register new user
 * @param {object} userData - { firstName, lastName, email, password }
 * @returns {object} { message, token, user }
 * @throws {AppError} If user already exists or validation fails
 */
export const registerUser = async (userData) => {
  const { firstName, lastName, email, password } = userData;

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new AppError("User with this email already exists", 409);
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      password: hashedPassword,
    },
  });

  const token = generateToken(user);

  return createAuthResponse(user, token, "User registered successfully");
};

/**
 * Login user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {object} { message, token, user }
 * @throws {AppError} If credentials are invalid
 */
export const loginUser = async (email, password) => {
  // Find user
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  // Verify password
  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    throw new AppError("Invalid email or password", 401);
  }

  const token = generateToken(user);

  return createAuthResponse(user, token, "Login successful");
};

/**
 * Get user profile with listings
 * @param {string} userId - User ID
 * @returns {object} User profile with listings
 * @throws {AppError} If user not found
 */
export const getUserProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      listings: {
        select: {
          id: true,
          title: true,
          price: true,
          createdAt: true,
        },
      },
    },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return createUserProfileResponse(user);
};

/**
 * Request OTP for password reset
 * @param {string} email - User email
 * @returns {object} { message }
 * @throws {AppError} If user not found
 */
export const requestPasswordReset = async (email) => {
  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  // Invalidate old unused OTPs
  await prisma.otpToken.updateMany({
    where: { email, used: false },
    data: { used: true },
  });

  // Generate new OTP
  const otp = generateOtp();
  const expiresAt = getOtpExpiry();

  await prisma.otpToken.create({
    data: {
      email,
      token: otp,
      expiresAt,
    },
  });

  // Send OTP email
  await sendOtpEmail(email, otp);

  return { message: "OTP sent to your email" };
};

/**
 * Verify OTP (used for password reset)
 * @param {string} email - User email
 * @param {string} otp - OTP code
 * @returns {object} { message, token, user }
 * @throws {AppError} If OTP is invalid or expired
 */
export const verifyPasswordResetOtp = async (email, otp) => {
  // Find valid OTP
  const otpRecord = await prisma.otpToken.findFirst({
    where: {
      email,
      token: otp,
      used: false,
      expiresAt: {
        gt: new Date(),
      },
    },
  });

  if (!otpRecord) {
    throw new AppError("Invalid or expired OTP", 401);
  }

  // Mark OTP as used
  await prisma.otpToken.update({
    where: { id: otpRecord.id },
    data: { used: true },
  });

  // Get user and generate token
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const token = generateToken(user);

  return createAuthResponse(user, token, "OTP verified successfully");
};
