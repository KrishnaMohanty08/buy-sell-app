import '../styles/globals.css';

const STATS = [
  { num: "42K+", label: "Active Sellers" },
  { num: "180K", label: "Live Listings" },
  { num: "98%",  label: "Satisfaction" },
];

const CARDS = [
  {
    cls: "left",
    imgStyle: { height: 100, background: "linear-gradient(135deg,rgba(242,185,73,0.18),rgba(242,116,48,0.12))" },
    cat: "Vintage", name: "Leather Tote", price: "$240",
  },
  {
    cls: "main",
    imgStyle: { height: 160, background: "linear-gradient(145deg,rgba(242,185,73,0.24),rgba(242,116,48,0.15))" },
    cat: "Collectibles", name: "Ceramic Vase — Edo", price: "$1,280",
  },
  {
    cls: "right",
    imgStyle: { height: 90, background: "linear-gradient(135deg,rgba(237,211,119,0.2),rgba(242,232,41,0.1))" },
    cat: "Art", name: "Print #07", price: "$580",
  },
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
          {/* Glow orbs */}
          <div
            className="glow-orb"
            style={{
              width: 300, height: 300, top: -50, right: -50,
              background: "radial-gradient(circle, rgba(242,185,73,0.14), transparent 70%)",
            }}
          />
          <div
            className="glow-orb"
            style={{
              width: 200, height: 200, bottom: -30, left: -30,
              background: "radial-gradient(circle, rgba(242,116,48,0.11), transparent 70%)",
            }}
          />

          <div className="product-showcase">
            {CARDS.map(({ cls, imgStyle, cat, name, price }) => (
              <div key={cls} className={`card-float ${cls}`}>
                <div className="card-img" style={imgStyle} />
                <div className="card-body">
                  <div className="card-cat">{cat}</div>
                  <div className="card-name">{name}</div>
                  <div className="card-price">{price}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
  );}