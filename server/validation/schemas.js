/**
 * Input validation schemas
 * Validates request data before processing
 */

import AppError from "../utils/AppError.js";

// Constants
const CONDITION_VALUES = ["NEW", "LIKE_NEW", "USED"];
const MAX_QUANTITY = 99;
const MIN_PASSWORD_LENGTH = 6;
const MAX_PRICE = 999999;
const MAX_TITLE_LENGTH = 100;
const MIN_TITLE_LENGTH = 5;
const MAX_DESCRIPTION_LENGTH = 5000;
const MIN_DESCRIPTION_LENGTH = 10;

/**
 * Validate registration input
 * @throws {AppError} If validation fails
 */
export const validateRegister = (data) => {
  const errors = {};

  // First name
  if (!data.firstName || !String(data.firstName).trim()) {
    errors.firstName = "First name is required";
  } else if (String(data.firstName).length > 50) {
    errors.firstName = "First name cannot exceed 50 characters";
  }

  // Last name
  if (!data.lastName || !String(data.lastName).trim()) {
    errors.lastName = "Last name is required";
  } else if (String(data.lastName).length > 50) {
    errors.lastName = "Last name cannot exceed 50 characters";
  }

  // Email
  if (!data.email || !String(data.email).trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(data.email))) {
    errors.email = "Please provide a valid email address";
  }

  // Password
  if (!data.password || !String(data.password).trim()) {
    errors.password = "Password is required";
  } else if (String(data.password).length < MIN_PASSWORD_LENGTH) {
    errors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
  }

  if (Object.keys(errors).length > 0) {
    throw new AppError("Validation failed", 400, errors);
  }

  return data;
};

/**
 * Validate login input
 * @throws {AppError} If validation fails
 */
export const validateLogin = (data) => {
  const errors = {};

  // Email
  if (!data.email || !String(data.email).trim()) {
    errors.email = "Email is required";
  }

  // Password
  if (!data.password || !String(data.password).trim()) {
    errors.password = "Password is required";
  }

  if (Object.keys(errors).length > 0) {
    throw new AppError("Validation failed", 400, errors);
  }

  return data;
};

/**
 * Validate create listing input
 * @throws {AppError} If validation fails
 */
export const validateCreateListing = (data) => {
  const errors = {};

  // Title
  if (!data.title || !String(data.title).trim()) {
    errors.title = "Title is required";
  } else if (String(data.title).length < MIN_TITLE_LENGTH) {
    errors.title = `Title must be at least ${MIN_TITLE_LENGTH} characters`;
  } else if (String(data.title).length > MAX_TITLE_LENGTH) {
    errors.title = `Title cannot exceed ${MAX_TITLE_LENGTH} characters`;
  }

  // Description
  if (!data.description || !String(data.description).trim()) {
    errors.description = "Description is required";
  } else if (String(data.description).length < MIN_DESCRIPTION_LENGTH) {
    errors.description = `Description must be at least ${MIN_DESCRIPTION_LENGTH} characters`;
  } else if (String(data.description).length > MAX_DESCRIPTION_LENGTH) {
    errors.description = `Description cannot exceed ${MAX_DESCRIPTION_LENGTH} characters`;
  }

  // Price
  if (data.askingPrice === undefined || data.askingPrice === null) {
    errors.askingPrice = "Price is required";
  } else {
    const price = Number(data.askingPrice);
    if (Number.isNaN(price) || price < 0) {
      errors.askingPrice = "Price must be a valid positive number";
    }
    if (price > MAX_PRICE) {
      errors.askingPrice = `Price cannot exceed ${MAX_PRICE}`;
    }
  }

  // Category
  if (!data.category || !String(data.category).trim()) {
    errors.category = "Category is required";
  }

  // Condition
  if (!data.condition) {
    errors.condition = "Condition is required";
  } else {
    const condition = String(data.condition).toUpperCase();
    if (!CONDITION_VALUES.includes(condition)) {
      errors.condition = `Condition must be one of: ${CONDITION_VALUES.join(", ")}`;
    }
  }

  // Stock quantity
  if (data.stockQuantity !== undefined && data.stockQuantity !== null) {
    const stock = Number(data.stockQuantity);
    if (!Number.isInteger(stock) || stock < 1 || stock > 1000) {
      errors.stockQuantity = "Stock must be an integer between 1 and 1000";
    }
  }

  // Brand (optional)
  if (data.brand && String(data.brand).length > 100) {
    errors.brand = "Brand cannot exceed 100 characters";
  }

  if (Object.keys(errors).length > 0) {
    throw new AppError("Validation failed", 400, errors);
  }

  return data;
};

/**
 * Validate add to cart input
 * @throws {AppError} If validation fails
 */
export const validateAddToCart = (data) => {
  const errors = {};

  // Listing ID
  if (!data.listingId || !String(data.listingId).trim()) {
    errors.listingId = "Listing ID is required";
  }

  // Quantity
  if (data.quantity === undefined || data.quantity === null) {
    errors.quantity = "Quantity is required";
  } else {
    const quantity = Number(data.quantity);
    if (!Number.isInteger(quantity) || quantity < 1) {
      errors.quantity = "Quantity must be at least 1";
    }
    if (quantity > MAX_QUANTITY) {
      errors.quantity = `Quantity cannot exceed ${MAX_QUANTITY}`;
    }
  }

  if (Object.keys(errors).length > 0) {
    throw new AppError("Validation failed", 400, errors);
  }

  return data;
};

/**
 * Validate update cart item quantity
 * @throws {AppError} If validation fails
 */
export const validateUpdateCartQuantity = (data) => {
  const errors = {};

  // Quantity
  if (data.quantity === undefined || data.quantity === null) {
    errors.quantity = "Quantity is required";
  } else {
    const quantity = Number(data.quantity);
    if (!Number.isInteger(quantity) || quantity < 1) {
      errors.quantity = "Quantity must be at least 1";
    }
    if (quantity > MAX_QUANTITY) {
      errors.quantity = `Quantity cannot exceed ${MAX_QUANTITY}`;
    }
  }

  if (Object.keys(errors).length > 0) {
    throw new AppError("Validation failed", 400, errors);
  }

  return data;
};

/**
 * Validate OTP request input
 * @throws {AppError} If validation fails
 */
export const validateOtpRequest = (data) => {
  const errors = {};

  if (!data.email || !String(data.email).trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(data.email))) {
    errors.email = "Please provide a valid email address";
  }

  if (Object.keys(errors).length > 0) {
    throw new AppError("Validation failed", 400, errors);
  }

  return data;
};

/**
 * Validate OTP verification input
 * @throws {AppError} If validation fails
 */
export const validateOtpVerification = (data) => {
  const errors = {};

  if (!data.email || !String(data.email).trim()) {
    errors.email = "Email is required";
  }

  if (!data.otp || !String(data.otp).trim()) {
    errors.otp = "OTP is required";
  }

  if (Object.keys(errors).length > 0) {
    throw new AppError("Validation failed", 400, errors);
  }

  return data;
};
