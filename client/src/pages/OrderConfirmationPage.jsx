import { useLocation, useNavigate } from 'react-router-dom';

export default function OrderConfirmationPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const orderIds = state?.orderIds || [];

  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", color: '#F2B949', marginBottom: '0.5rem' }}>
          Order Confirmed!
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '2rem' }}>
          Your payment was successful. {orderIds.length} item{orderIds.length > 1 ? 's' : ''} ordered.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button
            onClick={() => navigate('/orders')}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'linear-gradient(135deg, #F2B949, #F27430)',
              border: 'none', borderRadius: 8,
              color: '#1a1208', fontWeight: 600, cursor: 'pointer'
            }}
          >
            View Orders
          </button>
          <button
            onClick={() => navigate('/explore')}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'transparent',
              border: '1px solid rgba(242,185,73,0.4)',
              borderRadius: 8, color: '#F2B949', cursor: 'pointer'
            }}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </main>
  );
}