import prisma from '../prisma/client.js';
import razorpay from '../utils/razorpay.js';
import AppError from '../utils/AppError.js';
import crypto from 'crypto';

/**
 * Create Razorpay order + DB Order records
 * One Order record per cart item (matches your schema)
 */
export const createRazorpayOrder = async (userId, { addressId }) => {
  // 1. Get user's cart with items
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: { listing: true }
      }
    }
  });

  if (!cart || !cart.items.length) {
    throw new AppError('Cart is empty', 400);
  }

  // 2. Validate address belongs to user
  const address = await prisma.address.findUnique({
    where: { id: addressId }
  });

  if (!address || address.userId !== userId) {
    throw new AppError('Invalid address', 400);
  }

  // 3. Validate all listings still available
  for (const item of cart.items) {
    const listing = item.listing;
    if (!listing || listing.deletedAt || !listing.isActive || listing.isSold || listing.stock < item.quantity) {
      throw new AppError(`"${listing?.title}" is no longer available`, 409);
    }
  }

  // 4. Calculate total (Razorpay needs amount in paise — multiply by 100)
  const totalAmount = cart.items.reduce((sum, item) => {
    return sum + (item.listing.price * item.quantity);
  }, 0);

  // 5. Create Razorpay order
  const razorpayOrder = await razorpay.orders.create({
    amount: Math.round(totalAmount * 100), // paise
    currency: 'INR',
    receipt: `receipt_${userId}_${Date.now()}`,
  });

  // 6. Create DB Order records (one per cart item)
  const orders = await prisma.$transaction(
    cart.items.map(item =>
      prisma.order.create({
        data: {
          buyerId: userId,
          listingId: item.listingId,
          addressId,
          totalPrice: item.listing.price * item.quantity,
          status: 'PENDING',
        }
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

/**
 * Verify Razorpay payment signature + confirm orders
 */
export const verifyAndConfirmPayment = async (userId, {
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
  orderIds,
}) => {
  // 1. Verify signature (critical security step)
  const body = razorpayOrderId + '|' + razorpayPaymentId;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex');

  if (expectedSignature !== razorpaySignature) {
    throw new AppError('Payment verification failed', 400);
  }

  // 2. Update all orders to COMPLETED
  await prisma.order.updateMany({
    where: { 
      id: { in: orderIds },
      buyerId: userId // extra safety check
    },
    data: { status: 'COMPLETED' }
  });

  // 3. Calculate total payment amount
  const totalResult = await prisma.order.aggregate({
    where: { id: { in: orderIds } },
    _sum: { totalPrice: true }
  });

  const totalAmount = totalResult._sum.totalPrice || 0;

  // 4. Create Payment record for first order (links to one order in your schema)
  await prisma.payment.create({
    data: {
      orderId: orderIds[0],
      amount: totalAmount,
      status: 'SUCCESS',
      method: 'RAZORPAY',
    }
  });

  // 4. Clear the cart
  await prisma.cartItem.deleteMany({
    where: {
      cart: { userId }
    }
  });

  return { success: true, orderIds };
};

/**
 * Get all orders for a user
 */
export const getUserOrders = async (userId) => {
  return prisma.order.findMany({
    where: { buyerId: userId },
    include: {
      listing: {
        include: { images: true, category: true }
      },
      address: true,
    },
    orderBy: { createdAt: 'desc' }
  });
};