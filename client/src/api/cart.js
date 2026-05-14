import api from "./http";

export const addToCart = async (listingId, quantity = 1) => {
  const response = await api.post("/cart/add", { listingId, quantity });
  return response.data;
};

export const getCart = async () => {
  const response = await api.get("/cart");
  return response.data;
};

export const updateCartItemQuantity = async (cartItemId, quantity) => {
  const response = await api.patch(`/cart/item/${cartItemId}`, { quantity });
  return response.data;
};

export const removeFromCart = async (cartItemId) => {
  const response = await api.delete(`/cart/item/${cartItemId}`);
  return response.data;
};

export const clearCart = async () => {
  const response = await api.delete("/cart/clear");
  return response.data;
};
