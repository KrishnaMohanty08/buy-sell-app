import express from 'express';
import protect from '../middleware/authMiddleware.js';
import { createOrder, verifyPayment, getMyOrders } from '../controllers/orderController.js';

const router = express.Router();

router.use(protect);

router.post('/create', createOrder);
router.post('/verify', verifyPayment);
router.get('/mine', getMyOrders);

export default router;