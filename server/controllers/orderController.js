import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/AppError.js';
import * as orderService from '../services/order.service.js';

export const createOrder = asyncHandler(async (req, res) => {
    const {addressId}=req.body;
    if(!addressId){
        throw new AppError("Address ID is required",400);
    }
    const result = await orderService.createRazorpayOrder(req.user.id, { addressId });
  res.status(201).json(result);
});

export const verifyPayment = asyncHandler(async (req, res) => {
  const result = await orderService.verifyAndConfirmPayment(req.user.id, req.body);
  res.status(200).json(result);
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await orderService.getUserOrders(req.user.id);
  res.status(200).json({ orders });
});
