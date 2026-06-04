import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

/**
 * Custom error class for API failures
 * Provides consistent error handling across the application
 */
export class APIError extends Error {
  constructor(message, status = 500, details = null) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.details = details;
    this.isOperational = true;
  }
}

/**
 * Unified HTTP client using Axios
 * Features:
 * - Automatic token injection
 * - Consistent error handling
 * - Request/response interceptors
 */
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request interceptor: Inject auth token
 */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Response interceptor: Normalize error handling
 */
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status;
    const message =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong. Please try again.";

    const apiError = new APIError(
      message,
      status || 500,
      error.response?.data?.details || null
    );

    throw apiError;
  }
);

export default api;
