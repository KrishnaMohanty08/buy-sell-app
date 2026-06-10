import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useCartStore } from '../store/cartStore';
import { createOrder, verifyPayment } from '../api/order';
import { loadRazorpay, openRazorpayCheckout } from '../utils/razorpay';
import { formatCurrency } from '../utils/cart';
import api from '../api/http';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { items, totals, resetCart } = useCartStore();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Address form state
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({
    fullName: '', phone: '', street: '',
    city: '', state: '', postalCode: '', country: 'India',
  });

  // Fetch saved addresses
  useEffect(() => {
    api.get('/addresses').then(res => {
      setAddresses(res.data.addresses);
      const def = res.data.addresses.find(a => a.isDefault);
      if (def) setSelectedAddress(def.id);
    }).catch(() => {});
  }, []);

  const handleSaveAddress = async () => {
    // Validation
    const { fullName, phone, street, city, state, postalCode } = addressForm;
    if (!fullName || !phone || !street || !city || !state || !postalCode) {
      setError('All fields are required');
      return;
    }

    if (phone.length < 10) {
      setError('Phone number must be at least 10 digits');
      return;
    }

    setSavingAddress(true);
    setError(null);

    try {
      const res = await api.post('/addresses', {
        fullName,
        phone,
        street,
        city,
        state,
        postalCode,
        country: 'India'
      });
      
      if (!res.data || !res.data.address) {
        throw new Error('Invalid response from server');
      }

      const newAddress = res.data.address;
      setAddresses(prev => [...prev, newAddress]);
      setSelectedAddress(newAddress.id);
      setAddressForm({
        fullName: '', phone: '', street: '',
        city: '', state: '', postalCode: '', country: 'India',
      });
      setShowAddressForm(false);
    } catch (err) {
      console.error('Address save error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to save address');
    } finally {
      setSavingAddress(false);
    }
  };

  const handleCheckout = async () => {
    if (!selectedAddress) {
      setError('Please select a delivery address');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Load Razorpay script
      const loaded = await loadRazorpay();
      if (!loaded) throw new Error('Failed to load payment gateway');

      // 2. Create order on backend
      const orderData = await createOrder(selectedAddress);

      // 3. Open Razorpay checkout
      openRazorpayCheckout({
        razorpayOrderId: orderData.razorpayOrderId,
        amount: orderData.amount,
        currency: orderData.currency,
        keyId: import.meta.env.VITE_RAZORPAY_KEY_ID,
        userName: `${user.firstName} ${user.lastName}`,
        userEmail: user.email,
        onSuccess: async (paymentResponse) => {
          try {
            // 4. Verify payment on backend
            await verifyPayment({
              ...paymentResponse,
              orderIds: orderData.orderIds,
            });

            // 5. Clear cart + redirect
            resetCart();
            setLoading(false);
            navigate('/orders/confirmation', {
              state: { orderIds: orderData.orderIds }
            });
          } catch (err) {
            setError('Payment verification failed. Contact support.');
            setLoading(false);
          }
        },
        onFailure: () => {
          setError('Payment cancelled');
          setLoading(false);
        },
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ minHeight: '100vh', padding: '2rem 4vw', fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", color: '#F2B949', marginBottom: '2rem' }}>
          Checkout
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2rem' }}>
          {/* Left — Address */}
          <div>
            <h2 style={{ fontSize: '1rem', color: '#fff', marginBottom: '1rem' }}>
              Delivery Address
            </h2>

            {addresses.map(addr => (
              <div
                key={addr.id}
                onClick={() => setSelectedAddress(addr.id)}
                style={{
                  padding: '1rem', marginBottom: '0.75rem',
                  border: `1px solid ${selectedAddress === addr.id ? '#F2B949' : 'rgba(242,185,73,0.2)'}`,
                  borderRadius: 8, cursor: 'pointer',
                  background: selectedAddress === addr.id ? 'rgba(242,185,73,0.08)' : 'rgba(255,255,255,0.03)',
                }}
              >
                <p style={{ color: '#fff', margin: 0 }}>{addr.fullName}</p>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: '0.25rem 0 0' }}>
                  {addr.street}, {addr.city}, {addr.state} — {addr.postalCode}
                </p>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: '0.25rem 0 0' }}>
                  {addr.phone}
                </p>
              </div>
            ))}

            <button
              onClick={() => setShowAddressForm(!showAddressForm)}
              style={{
                background: 'transparent', border: '1px dashed rgba(242,185,73,0.4)',
                color: '#F2B949', padding: '0.75rem 1.5rem', borderRadius: 8,
                cursor: 'pointer', width: '100%', marginBottom: '1rem'
              }}
            >
              + Add New Address
            </button>

            {showAddressForm && (
              <div style={{ display: 'grid', gap: '0.75rem', marginBottom: '1rem', padding: '1rem', background: 'rgba(242,185,73,0.04)', borderRadius: 8, border: '1px solid rgba(242,185,73,0.15)' }}>
                <h3 style={{ color: '#F2B949', fontSize: '0.9rem', margin: '0 0 0.5rem 0' }}>New Address</h3>
                {['fullName', 'phone', 'street', 'city', 'state', 'postalCode'].map(field => (
                  <input
                    key={field}
                    placeholder={field === 'fullName' ? 'Full Name *' : field === 'postalCode' ? 'Postal Code *' : field.charAt(0).toUpperCase() + field.slice(1) + ' *'}
                    value={addressForm[field]}
                    onChange={e => setAddressForm(p => ({ ...p, [field]: e.target.value }))}
                    disabled={savingAddress}
                    style={{
                      padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(242,185,73,0.22)', borderRadius: 6,
                      color: '#fff', fontFamily: "'DM Sans', sans-serif",
                      opacity: savingAddress ? 0.5 : 1,
                      cursor: savingAddress ? 'not-allowed' : 'text'
                    }}
                  />
                ))}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <button
                    onClick={handleSaveAddress}
                    disabled={savingAddress}
                    style={{
                      background: savingAddress ? 'rgba(242,185,73,0.3)' : 'linear-gradient(135deg, #F2B949, #F27430)',
                      border: 'none', borderRadius: 6, padding: '0.75rem',
                      color: '#1a1208', fontWeight: 600, cursor: savingAddress ? 'not-allowed' : 'pointer',
                      opacity: savingAddress ? 0.7 : 1
                    }}
                  >
                    {savingAddress ? 'Saving...' : 'Save Address'}
                  </button>
                  <button
                    onClick={() => {
                      setShowAddressForm(false);
                      setAddressForm({
                        fullName: '', phone: '', street: '',
                        city: '', state: '', postalCode: '', country: 'India',
                      });
                      setError(null);
                    }}
                    disabled={savingAddress}
                    style={{
                      background: 'transparent', border: '1px solid rgba(242,185,73,0.3)',
                      color: '#F2B949', borderRadius: 6, padding: '0.75rem',
                      fontWeight: 600, cursor: savingAddress ? 'not-allowed' : 'pointer',
                      opacity: savingAddress ? 0.5 : 1
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right — Order Summary */}
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(242,185,73,0.2)',
            borderRadius: 12, padding: '1.5rem',
            position: 'sticky', top: 80, height: 'fit-content'
          }}>
            <h2 style={{ fontSize: '1rem', color: '#fff', marginBottom: '1rem' }}>
              Order Summary
            </h2>

            {items.map(item => (
              <div key={item.id} style={{
                display: 'flex', justifyContent: 'space-between',
                marginBottom: '0.75rem', fontSize: '0.85rem'
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
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#fff', fontWeight: 500 }}>Total</span>
                <span style={{ color: '#F2B949', fontSize: '1.4rem', fontFamily: "'Playfair Display', serif" }}>
                  {formatCurrency(totals.total)}
                </span>
              </div>
            </div>

            {error && (
              <p style={{ color: '#f87171', fontSize: '0.8rem', marginTop: '0.75rem' }}>{error}</p>
            )}

            <button
              onClick={handleCheckout}
              disabled={loading || !selectedAddress}
              style={{
                width: '100%', marginTop: '1.5rem', padding: '0.9rem',
                background: loading || !selectedAddress
                  ? 'rgba(242,185,73,0.3)'
                  : 'linear-gradient(135deg, #F2B949, #F27430)',
                border: 'none', borderRadius: 8,
                color: '#1a1208', fontWeight: 700,
                cursor: loading || !selectedAddress ? 'not-allowed' : 'pointer',
                fontSize: '0.95rem', fontFamily: "'DM Sans', sans-serif"
              }}
            >
              {loading ? 'Processing...' : `Pay ${formatCurrency(totals.total)}`}
            </button>

            <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', textAlign: 'center', marginTop: '0.75rem' }}>
              Secured by Razorpay
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}