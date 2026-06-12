import axios from 'axios';
import AppError from './AppError.js';

const getRazorpayConfig = () => {
  const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID?.trim();
  const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET?.trim();

  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    throw new AppError('Razorpay is not configured', 500);
  }

  return { keyId: RAZORPAY_KEY_ID, keySecret: RAZORPAY_KEY_SECRET };
};

const validateRazorpayOrderPayload = ({ amount, currency, receipt }) => {
  if (!Number.isInteger(amount) || amount <= 0) {
    throw new AppError('Invalid payment amount', 400);
  }

  if (currency !== 'INR') {
    throw new AppError('Invalid payment currency', 400);
  }

  if (!receipt || receipt.length > 40) {
    throw new AppError('Invalid payment receipt', 400);
  }
};

const getRazorpayErrorMessage = (error) => {
  const razorpayError = error?.response?.data?.error;
  const stringifiedError = String(error);

  return razorpayError?.description
    || razorpayError?.reason
    || razorpayError?.code
    || error?.response?.data?.message
    || error?.message
    || error?.code
    || error?.cause?.message
    || (stringifiedError !== '[object Object]' ? stringifiedError : null)
    || 'Unknown Razorpay error';
};

const getRazorpayErrorDetails = (error, payload) => {
  const message = getRazorpayErrorMessage(error);

  return {
    message,
    name: error?.name,
    type: error?.constructor?.name,
    code: error?.code,
    status: error?.response?.status,
    statusText: error?.response?.statusText,
    razorpayError: error?.response?.data?.error,
    responseData: error?.response?.data && !error.response.data.error ? error.response.data : undefined,
    hasRequest: Boolean(error?.request),
    cause: error?.cause?.message,
    errorKeys: error && typeof error === 'object' ? Object.keys(error) : undefined,
    payload: {
      amount: payload.amount,
      currency: payload.currency,
      receipt: payload.receipt,
    },
  };
};

export const createRazorpayOrder = async (payload) => {
  const { keyId, keySecret } = getRazorpayConfig();
  validateRazorpayOrderPayload(payload);

  try {
    const response = await axios.post('https://api.razorpay.com/v1/orders', payload, {
      auth: {
        username: keyId,
        password: keySecret,
      },
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 15000,
    });

    return response.data;
  } catch (error) {
    const details = getRazorpayErrorDetails(error, payload);
    console.error('[RAZORPAY_ORDER_CREATE_ERROR]', details);
    throw new AppError('Unable to create payment order. Please try again later.', 502, {
      reason: details.message,
    });
  }
};
