import '../../styles/globals.css';

const STATS = [
  { num: "42K+", lbl: "Sellers"  },
  { num: "180K", lbl: "Listings" },
  { num: "98%",  lbl: "Rated 5★" },
];

const CARDS = [
  { cat: "Vintage",      name: "Leather Tote",  price: "$240"   },
  { cat: "Collectibles", name: "Edo Vase",       price: "$1,280" },
];

export default function AuthLeftPanel() {
  return (
    <div className="auth-left">
        <div className="auth-left-bg" />
        <div className="auth-left-grid" />
        <div className="auth-left-glow" />

        {/* Brand */}
        <div className="auth-brand">
          <div className="auth-brand-logo">BAZAAR</div>
          <div className="auth-brand-tag">Premium Marketplace</div>
        </div>

        {/* Headline */}
        <div className="auth-left-middle">
          <h2 className="auth-left-title">
            Trade the<br /><em>extraordinary</em>
          </h2>
          <p className="auth-left-sub">
            Buy and sell rare, vintage, and curated goods with the confidence of a trusted community.
          </p>
        </div>

        {/* Stats */}
        <div className="auth-trust-row">
          {STATS.map(({ num, lbl }) => (
            <div key={lbl}>
              <div className="auth-trust-num">{num}</div>
              <div className="auth-trust-lbl">{lbl}</div>
            </div>
          ))}
        </div>

        {/* Floating product cards */}
        <div className="auth-float-cards">
          {CARDS.map(({ cat, name, price }) => (
            <div key={name} className="auth-mini-card">
              <div className="auth-mc-cat">{cat}</div>
              <div className="auth-mc-name">{name}</div>
              <div className="auth-mc-price">{price}</div>
            </div>
          ))}
        </div>
      </div>
  );
}
