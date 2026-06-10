// Loads Razorpay checkout script dynamically
export const loadRazorpay = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const openRazorpayCheckout = ({
  razorpayOrderId,
  amount,
  currency,
  keyId,
  userName,
  userEmail,
  onSuccess,
  onFailure,
}) => {
  const options = {
    key: keyId,
    amount: amount * 100, // paise
    currency,
    name: 'BAZAAR',
    description: 'Marketplace Purchase',
    order_id: razorpayOrderId,
    handler: function (response) {
      // Called on successful payment
      onSuccess({
        razorpayOrderId: response.razorpay_order_id,
        razorpayPaymentId: response.razorpay_payment_id,
        razorpaySignature: response.razorpay_signature,
      });
    },
    prefill: {
      name: userName,
      email: userEmail,
    },
    theme: {
      color: '#F2B949', // your gold color
    },
    modal: {
      ondismiss: onFailure,
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
};