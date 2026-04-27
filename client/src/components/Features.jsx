import '../styles/globals.css';

const FEATURES = [
  {
    id: 'verified',
    title: 'Verified Sellers',
    text: 'Every seller profile goes through identity checks and listing moderation before going live.',
    metric: '24h',
    metricLabel: 'avg verification',
  },
  {
    id: 'secure',
    title: 'Secure Payments',
    text: 'Escrow-backed checkout protects buyers and releases payouts only after successful delivery.',
    metric: '99.2%',
    metricLabel: 'secure transactions',
  },
  {
    id: 'shipping',
    title: 'Smart Logistics',
    text: 'Integrated shipping labels, live tracking, and delivery support for smooth cross-city selling.',
    metric: '180+',
    metricLabel: 'cities covered',
  },
];

export default function Features() {
  return (
    <section className="home-section home-features" aria-labelledby="features-title">
      <div className="home-section-head">
        <p className="home-kicker">Why Bazaar Works</p>
        <h2 id="features-title" className="home-section-title">Built for trust and speed</h2>
      </div>

      <div className="feature-grid">
        {FEATURES.map((item) => (
          <article key={item.id} className="feature-card">
            <p className="feature-metric">{item.metric}</p>
            <p className="feature-metric-label">{item.metricLabel}</p>
            <h3 className="feature-title">{item.title}</h3>
            <p className="feature-text">{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}