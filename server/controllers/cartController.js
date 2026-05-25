import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import {
  validateAddToCart,
  validateUpdateCartQuantity,
} from "../validation/schemas.js";
import * as cartService from "../services/cart.service.js";

const getAuthenticatedUserId = (req) => {
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError("Unauthorized", 401);
  }

  return userId;
};

/**
 * Add item to cart
 * POST /api/cart/add
 * Requires: Authorization header with Bearer token
 */
export const addToCart = asyncHandler(async (req, res) => {
  validateAddToCart(req.body);

  const result = await cartService.addToCart(getAuthenticatedUserId(req), req.body);
  const { statusCode = 200, ...payload } = result;

  return res.status(statusCode).json(payload);
});

/**
 * Get user's cart
 * GET /api/cart
 * Requires: Authorization header with Bearer token
 */
export const getCart = asyncHandler(async (req, res) => {
  const result = await cartService.getCart(getAuthenticatedUserId(req));
  return res.status(200).json(result);
});

/**
 * Update cart item quantity
 * PATCH /api/cart/item/:id
 * Requires: Authorization header with Bearer token
 */
export const updateCartItemQuantity = asyncHandler(async (req, res) => {
  validateUpdateCartQuantity(req.body);

  const result = await cartService.updateCartItem(
    getAuthenticatedUserId(req),
    req.params.id,
    req.body.quantity
  );

  return res.status(200).json(result);
});

/**
 * Remove item from cart
 * DELETE /api/cart/item/:id
 * Requires: Authorization header with Bearer token
 */
export const removeFromCart = asyncHandler(async (req, res) => {
  const result = await cartService.removeCartItem(getAuthenticatedUserId(req), req.params.id);
  return res.status(200).json(result);
});

/**
 * Clear entire cart
 * DELETE /api/cart/clear
 * Requires: Authorization header with Bearer token
 */
export const clearCart = asyncHandler(async (req, res) => {
  const result = await cartService.clearCart(getAuthenticatedUserId(req));
  return res.status(200).json(result);
});
