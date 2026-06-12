import api from './http.js';

export const createOrder = async (address) => {
  return api.post('/orders/create', { address });
};

export const verifyPayment = async (data) => {
  return api.post('/orders/verify', data);
};

export const getMyOrders = async () => {
  return api.get('/orders/mine');
};
