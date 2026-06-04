import '../styles/globals.css';
import InteractiveCharacter from './InteractiveCharacter';

const STATS = [
  { num: "42K+", label: "Active Sellers" },
  { num: "180K", label: "Live Listings" },
  { num: "98%",  label: "Satisfaction" },
];

export default function Hero({ onShop, onSell }) {
  return (
    <section className="hero-section">
        <div className="hero-grid-bg" />
        <div className="hero-radial" />

        {/* Left content */}
        <div className="hero-content">
          <div className="hero-eyebrow">
            <span className="eyebrow-dot" />
            New season drops live
          </div>

          <h1 className="hero-title">
            Buy &amp; sell<br />
            the <em>extraordinary</em>
          </h1>

          <p className="hero-sub">
            A curated marketplace where rare finds meet discerning buyers.
            List in minutes, discover without limits.
          </p>

          <div className="hero-cta">
            <button className="btn-hero-primary" onClick={onShop}>
              Start Shopping
            </button>
            <button className="btn-hero-ghost" onClick={onSell}>
              List an Item
            </button>
          </div>

          <div className="hero-stats">
            {STATS.map(({ num, label }) => (
              <div key={label}>
                <div className="stat-num">{num}</div>
                <div className="stat-label">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right visual */}
        <div className="hero-visual">
          <InteractiveCharacter />
        </div>
      </section>
  );}