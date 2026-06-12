import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useCartStore } from '../store/cartStore';
import { createOrder, verifyPayment } from '../api/order';
import { loadRazorpay, openRazorpayCheckout } from '../utils/razorpay';
import { formatCurrency } from '../utils/cart';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { items, totals, resetCart } = useCartStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [address, setAddress] = useState({
    fullName: '', phone: '', street: '',
    city: '', state: '', postalCode: '', country: 'India',
  });

  const set = (field) => (e) =>
    setAddress((prev) => ({ ...prev, [field]: e.target.value }));

  const isFormValid =
    address.fullName && address.phone && address.street &&
    address.city && address.state && address.postalCode;

  const handleCheckout = async () => {
    if (!isFormValid) {
      setError('Please fill in all address fields');
      return;
    }
    if (address.phone.replace(/\D/g, '').length < 10) {
      setError('Phone number must be at least 10 digits');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const loaded = await loadRazorpay();
      if (!loaded) throw new Error('Failed to load payment gateway');

      // Pass inline address directly to createOrder
      const orderData = await createOrder(address);
      if (!orderData?.razorpayOrderId) {
        throw new Error('Unable to create payment order. Please try again.');
      }

      openRazorpayCheckout({
        razorpayOrderId: orderData.razorpayOrderId,
        amount: orderData.amount,
        currency: orderData.currency,
        keyId: import.meta.env.VITE_RAZORPAY_KEY_ID,
        userName: `${user.firstName} ${user.lastName}`,
        userEmail: user.email,
        onSuccess: async (paymentResponse) => {
          try {
            await verifyPayment({ ...paymentResponse, orderIds: orderData.orderIds });
            resetCart();
            setLoading(false);
            navigate('/orders/confirmation', { state: { orderIds: orderData.orderIds } });
          } catch {
            setError('Payment verification failed. Please contact support.');
            setLoading(false);
          }
        },
        onFailure: () => {
          setError('Payment cancelled.');
          setLoading(false);
        },
      });
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const inputStyle = {
    padding: '0.75rem 1rem',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(242,185,73,0.22)',
    borderRadius: 6,
    color: '#fff',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '0.9rem',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
  };

  const fields = [
    { key: 'fullName',   label: 'Full Name',    span: 2 },
    { key: 'phone',      label: 'Phone',        span: 1 },
    { key: 'street',     label: 'Street / Area',span: 2 },
    { key: 'city',       label: 'City',         span: 1 },
    { key: 'state',      label: 'State',        span: 1 },
    { key: 'postalCode', label: 'Postal Code',  span: 1 },
  ];

  return (
    <main style={{ minHeight: '100vh', padding: '2rem 4vw', fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", color: '#F2B949', marginBottom: '2rem' }}>
          Checkout
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2rem', alignItems: 'start' }}>

          {/* ── Left: Address Form ── */}
          <div>
            <h2 style={{ fontSize: '1rem', color: '#fff', marginBottom: '1.25rem' }}>
              Delivery Address
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {fields.map(({ key, label, span }) => (
                <input
                  key={key}
                  placeholder={label + ' *'}
                  value={address[key]}
                  onChange={set(key)}
                  disabled={loading}
                  style={{ ...inputStyle, gridColumn: `span ${span}`, opacity: loading ? 0.5 : 1 }}
                />
              ))}
            </div>
          </div>

          {/* ── Right: Order Summary ── */}
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(242,185,73,0.2)',
            borderRadius: 12, padding: '1.5rem',
            position: 'sticky', top: 80,
          }}>
            <h2 style={{ fontSize: '1rem', color: '#fff', marginBottom: '1rem' }}>
              Order Summary
            </h2>

            {items.map(item => (
              <div key={item.id} style={{
                display: 'flex', justifyContent: 'space-between',
                marginBottom: '0.75rem', fontSize: '0.85rem',
              }}>
                <span style={{ color: 'rgba(255,255,255,0.7)' }}>
                  {item.listing?.title} × {item.quantity}
                </span>
                <span style={{ color: '#F2B949' }}>
                  {formatCurrency(item.unitPrice * item.quantity)}
                </span>
              </div>
            ))}

            <div style={{ borderTop: '1px solid rgba(242,185,73,0.15)', paddingTop: '1rem', marginTop: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ color: '#fff', fontWeight: 500 }}>Total</span>
                <span style={{ color: '#F2B949', fontSize: '1.4rem', fontFamily: "'Playfair Display', serif" }}>
                  {formatCurrency(totals.total)}
                </span>
              </div>
            </div>

            {error && (
              <p style={{ color: '#f87171', fontSize: '0.8rem', marginTop: '0.75rem', margin: '0.75rem 0 0' }}>
                {error}
              </p>
            )}

            <button
              onClick={handleCheckout}
              disabled={loading || !isFormValid}
              style={{
                width: '100%', marginTop: '1.5rem', padding: '0.9rem',
                background: loading || !isFormValid
                  ? 'rgba(242,185,73,0.3)'
                  : 'linear-gradient(135deg, #F2B949, #F27430)',
                border: 'none', borderRadius: 8,
                color: '#1a1208', fontWeight: 700,
                cursor: loading || !isFormValid ? 'not-allowed' : 'pointer',
                fontSize: '0.95rem', fontFamily: "'DM Sans', sans-serif",
                transition: 'opacity 0.2s',
              }}
            >
              {loading ? 'Processing…' : `Pay ${formatCurrency(totals.total)}`}
            </button>

            <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', textAlign: 'center', marginTop: '0.75rem', marginBottom: 0 }}>
              Secured by Razorpay
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
