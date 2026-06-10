import api from './http.js';

export const createOrder = async (addressId) => {
  const response = await api.post('/orders/create', { addressId });
  return response.data;
};

export const verifyPayment = async (data) => {
  const response = await api.post('/orders/verify', data);
  return response.data;
};

export const getMyOrders = async () => {
  const response = await api.get('/orders/mine');
  return response.data;
};