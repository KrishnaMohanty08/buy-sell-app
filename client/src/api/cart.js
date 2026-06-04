import api from "./http.js";

/**
 * Add item to cart
 * @param {string} listingId - Listing ID
 * @param {number} quantity - Quantity (default: 1)
 * @returns {Promise<object>} Cart with added item
 */
export const addToCart = async (listingId, quantity = 1) => {
  const response = await api.post("/cart/add", { listingId, quantity });
  return response;
};

/**
 * Get current user's cart
 * @returns {Promise<object>} Cart object with items and totals
 */
export const getCart = async () => {
  const response = await api.get("/cart");
  return response;
};

/**
 * Update quantity of item in cart
 * @param {string} cartItemId - Cart item ID
 * @param {number} quantity - New quantity
 * @returns {Promise<object>} Updated cart
 */
export const updateCartItemQuantity = async (cartItemId, quantity) => {
  const response = await api.patch(`/cart/item/${cartItemId}`, { quantity });
  return response;
};

/**
 * Remove item from cart
 * @param {string} cartItemId - Cart item ID
 * @returns {Promise<object>} Updated cart
 */
export const removeFromCart = async (cartItemId) => {
  const response = await api.delete(`/cart/item/${cartItemId}`);
  return response;
};

/**
 * Clear entire cart
 * @returns {Promise<object>} Empty cart response
 */
export const clearCart = async () => {
  const response = await api.delete("/cart/clear");
  return response;
};
