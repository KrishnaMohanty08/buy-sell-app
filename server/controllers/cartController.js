import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import * as cartService from "../services/cart.service.js";

const getAuthenticatedUserId = (req) => {
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError("Unauthorized", 401);
  }

  return userId;
};

export const addToCart = asyncHandler(async (req, res) => {
  const result = await cartService.addToCart(getAuthenticatedUserId(req), req.body);
  const { statusCode = 200, ...payload } = result;

  return res.status(statusCode).json(payload);
});

export const getCart = asyncHandler(async (req, res) => {
  const result = await cartService.getCart(getAuthenticatedUserId(req));
  return res.status(200).json(result);
});

export const updateCartItemQuantity = asyncHandler(async (req, res) => {
  const result = await cartService.updateCartItem(
    getAuthenticatedUserId(req),
    req.params.id,
    req.body.quantity
  );

  return res.status(200).json(result);
});

export const removeFromCart = asyncHandler(async (req, res) => {
  const result = await cartService.removeCartItem(getAuthenticatedUserId(req), req.params.id);
  return res.status(200).json(result);
});

export const clearCart = asyncHandler(async (req, res) => {
  const result = await cartService.clearCart(getAuthenticatedUserId(req));
  return res.status(200).json(result);
});
