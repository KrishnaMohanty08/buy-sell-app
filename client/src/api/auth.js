import api from "./http.js";

/**
 * Serialize user response (remove sensitive fields)
 */
const serializeUser = (user) => ({
  id: user.id,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  profileImage: user.profileImage,
  listings: user.listings,
});

/**
 * Login user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<{token: string, user: object, message: string}>}
 */
export const login = async (email, password) => {
  const data = await api.post("/auth/login", { email, password });
  if (data.token) {
    localStorage.setItem("authToken", data.token);
  }
  return data;
};

/**
 * Register new user
 * @param {string} firstName - First name
 * @param {string} lastName - Last name
 * @param {string} email - Email address
 * @param {string} password - Password
 * @returns {Promise<{token: string, user: object, message: string}>}
 */
export const register = async (firstName, lastName, email, password) => {
  const data = await api.post("/auth/register", {
    firstName,
    lastName,
    email,
    password,
  });
  if (data.token) {
    localStorage.setItem("authToken", data.token);
  }
  return data;
};

/**
 * Request OTP for password reset
 * @param {string} email - User email
 * @returns {Promise<{message: string}>}
 */
export const requestOtp = async (email) => {
  return api.post("/auth/request-otp", { email });
};

/**
 * Verify OTP and reset password
 * @param {string} email - User email
 * @param {string} otp - OTP code
 * @returns {Promise<{token: string, user: object, message: string}>}
 */
export const verifyOtp = async (email, otp) => {
  const data = await api.post("/auth/verify-otp", { email, otp });
  if (data.token) {
    localStorage.setItem("authToken", data.token);
  }
  return data;
};

/**
 * Get current authenticated user
 * @returns {Promise<object>} Current user profile
 */
export const getCurrentUser = async () => {
  const data = await api.get("/auth/user");
  return serializeUser(data);
};

/**
 * Logout user (clear token)
 */
export const logout = () => {
  localStorage.removeItem("authToken");
};

/**
 * Get stored authentication token
 * @returns {string|null} Token or null
 */
export const getToken = () => {
  return localStorage.getItem("authToken");
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if token exists
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem("authToken");
};