import prisma from '../prisma/client.js';
import { createRazorpayOrder as createPaymentGatewayOrder } from '../utils/razorpay.js';
import AppError from '../utils/AppError.js';
import crypto from 'crypto';

export const createRazorpayOrder = async (userId, { address }) => {
  // 1. Get user's cart
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: { include: { listing: true } } }
  });

  if (!cart || !cart.items.length) throw new AppError('Cart is empty', 400);

  // 2. Validate listings
  for (const item of cart.items) {
    const l = item.listing;
    if (!l || l.deletedAt || !l.isActive || l.isSold || l.stock < item.quantity) {
      throw new AppError(`"${l?.title}" is no longer available`, 409);
    }
  }

  // 3. Create address inline
  const savedAddress = await prisma.address.create({
    data: { ...address, userId },
  });

  // 4. Total + Razorpay order
  const totalAmount = cart.items.reduce((sum, item) =>
    sum + parseFloat(item.listing.price) * item.quantity, 0);
  const receipt = `rcpt_${Date.now().toString(36)}_${crypto.randomBytes(4).toString('hex')}`;

  // 5. Create Razorpay order
  const razorpayOrder = await createPaymentGatewayOrder({
    amount: Math.round(totalAmount * 100), // paise
    currency: 'INR',
    receipt,
  });

  // 5. Create one DB Order per cart item
  const orders = await prisma.$transaction(
    cart.items.map(item =>
      prisma.order.create({
        data: {
          buyerId: userId,
          listingId: item.listingId,
          addressId: savedAddress.id,
          totalPrice: parseFloat(item.listing.price) * item.quantity,
          status: 'PENDING',
        },
      })
    )
  );

  return {
    razorpayOrderId: razorpayOrder.id,
    amount: totalAmount,
    currency: 'INR',
    orderIds: orders.map(o => o.id),
  };
};

export const verifyAndConfirmPayment = async (userId, {
  razorpayOrderId, razorpayPaymentId, razorpaySignature, orderIds,
}) => {
  const body = razorpayOrderId + '|' + razorpayPaymentId;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex');

  if (expectedSignature !== razorpaySignature) throw new AppError('Payment verification failed', 400);

  await prisma.order.updateMany({
    where: { id: { in: orderIds }, buyerId: userId },
    data: { status: 'COMPLETED' },
  });

  const totalResult = await prisma.order.aggregate({
    where: { id: { in: orderIds } },
    _sum: { totalPrice: true },
  });

  await prisma.payment.create({
    data: {
      orderId: orderIds[0],
      amount: totalResult._sum.totalPrice || 0,
      status: 'SUCCESS',
      method: 'RAZORPAY',
    },
  });

  await prisma.cartItem.deleteMany({ where: { cart: { userId } } });

  return { success: true, orderIds };
};

export const getUserOrders = async (userId) => {
  return prisma.order.findMany({
    where: { buyerId: userId },
    include: {
      listing: { include: { images: true, category: true } },
      address: true,
    },
    orderBy: { createdAt: 'desc' },
  });
};
