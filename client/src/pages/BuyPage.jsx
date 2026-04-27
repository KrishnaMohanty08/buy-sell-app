import { useState } from "react";
import "../styles/globals.css";
import "../styles/pageStyles.css";

const PRODUCT = {
  title: "Vintage Gold Chronograph Watch",
  category: "Collectibles",
  price: 84500, oldPrice: 120000,
  condition: "Like New", negotiable: true,
  emoji: "⌚",
  thumbs: ["⌚","🔍","📦","🪙"],
  seller: { name: "AuraCollects", avatar: "A", rating: 4.9, sales: 312, responseTime: "~2 hrs" },
  rating: 4.8, reviewCount: 86, soldCount: 43,
};

const REVIEWS = [
  { name:"Rohan M.", date:"Apr 2026", rating:5, body:"Absolutely stunning piece. The seller packaged it immaculately and it arrived exactly as described. Highly recommend." },
  { name:"Priya S.", date:"Mar 2026", rating:4, body:"Great condition, matches the photos perfectly. Shipping was a bit slow but the item itself is beautiful." },
  { name:"Aarav K.", date:"Feb 2026", rating:5, body:"Legit seller. Genuine vintage piece with original box. Worth every rupee." },
];

const SIMILAR = [
  { title:"Art Deco Bracelet",       price:12000, emoji:"💎" },
  { title:"1950s Compass",           price:4500,  emoji:"🧭" },
  { title:"Collector's Coin Set",    price:8800,  emoji:"🪙" },
  { title:"Vintage Fountain Pen",    price:3200,  emoji:"🖊️" },
];

const BAR_DATA = [
  {stars:5, pct:72}, {stars:4, pct:18}, {stars:3, pct:6}, {stars:2, pct:2}, {stars:1, pct:2}
];

export default function BuyPage() {
  const [activeThumb, setActiveThumb] = useState(0);
  const [wished, setWished] = useState(false);
  const [qty, setQty] = useState(1);
  const [cartAdded, setCartAdded] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [offerOpen, setOfferOpen] = useState(false);

  const handleAddCart = () => setCartAdded(true);

  return (
    <>
      <div className="buy-page">
        <div className="buy-inner">
          {/* Breadcrumb */}
          <div className="breadcrumb">
            <a>Home</a><span>/</span>
            <a>Explore</a><span>/</span>
            <a>Collectibles</a><span>/</span>
            <strong>{PRODUCT.title}</strong>
          </div>

          {/* Main layout */}
          <div className="product-layout">
            {/* Gallery */}
            <div className="gallery">
              <div className="gallery-main">
                <span className="gallery-main-badge">30% OFF</span>
                <span style={{fontSize:"7rem"}}>{PRODUCT.thumbs[activeThumb]}</span>
                <div
                  className={`gallery-main-wish ${wished ? "wished" : ""}`}
                  onClick={() => setWished(p => !p)}
                >
                  {wished ? "❤️" : "🤍"}
                </div>
              </div>
              <div className="gallery-thumbs">
                {PRODUCT.thumbs.map((t, i) => (
                  <div
                    key={i}
                    className={`gallery-thumb ${activeThumb === i ? "active" : ""}`}
                    onClick={() => setActiveThumb(i)}
                  >
                    {t}
                  </div>
                ))}
              </div>
            </div>

            {/* Info */}
            <div className="info-panel">
              <div>
                <div className="info-category">{PRODUCT.category}</div>
                <div className="info-top-row">
                  <h1 className="info-title">{PRODUCT.title}</h1>
                  <button className="info-share">⬆ Share</button>
                </div>
              </div>

              {/* Rating */}
              <div className="rating-row">
                <div className="stars">
                  {[1,2,3,4,5].map(s => (
                    <span key={s} className="star">{s <= Math.round(PRODUCT.rating) ? "⭐" : "☆"}</span>
                  ))}
                </div>
                <span className="rating-num">{PRODUCT.rating}</span>
                <span className="rating-count">({PRODUCT.reviewCount} reviews)</span>
                <span className="sold-badge">{PRODUCT.soldCount} sold</span>
              </div>

              {/* Price */}
              <div className="price-block">
                <div>
                  <span className="price-main">₹{PRODUCT.price.toLocaleString()}</span>
                  <span className="price-old">₹{PRODUCT.oldPrice.toLocaleString()}</span>
                  <span className="price-discount">30% off</span>
                </div>
                <div className="price-sub">Inclusive of all taxes · Free shipping</div>
              </div>

              {/* Condition */}
              <div className="cond-block">
                <span className="cond-chip">{PRODUCT.condition}</span>
                {PRODUCT.negotiable && <span className="neg-chip">💬 Negotiable</span>}
              </div>

              {/* Quantity */}
              <div className="qty-row">
                <span className="qty-label">Qty</span>
                <div className="qty-ctrl">
                  <button className="qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                  <div className="qty-num">{qty}</div>
                  <button className="qty-btn" onClick={() => setQty(q => q + 1)}>+</button>
                </div>
                <span style={{fontSize:"0.75rem",color:"var(--muted)"}}>Only 2 left</span>
              </div>

              {/* CTAs */}
              <div className="cta-stack">
                <button className="btn-buy">⚡ Buy Now</button>
                <button className={`btn-cart ${cartAdded ? "added" : ""}`} onClick={handleAddCart}>
                  {cartAdded ? "✓ Added to Cart" : "🛒 Add to Cart"}
                </button>
                {PRODUCT.negotiable && (
                  <button className="btn-offer" onClick={() => setOfferOpen(true)}>
                    💬 Make an Offer
                  </button>
                )}
              </div>

              {/* Trust */}
              <div className="trust-row">
                <div className="trust-item">
                  <div className="trust-icon">🛡️</div>
                  <div className="trust-label">Buyer<br/>Protection</div>
                </div>
                <div className="trust-item">
                  <div className="trust-icon">↩️</div>
                  <div className="trust-label">Easy<br/>Returns</div>
                </div>
                <div className="trust-item">
                  <div className="trust-icon">✅</div>
                  <div className="trust-label">Verified<br/>Seller</div>
                </div>
              </div>

              <div className="divider" />

              {/* Seller */}
              <div className="seller-card">
                <div className="seller-avatar">{PRODUCT.seller.avatar}</div>
                <div className="seller-info">
                  <div className="seller-name">{PRODUCT.seller.name}</div>
                  <div className="seller-meta">
                    <strong>{PRODUCT.seller.rating}★</strong> · {PRODUCT.seller.sales} sales · responds in {PRODUCT.seller.responseTime}
                  </div>
                </div>
                <button className="btn-msg">Message</button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="tabs-section">
            <div className="tabs-nav">
              {["description","specs","reviews"].map(t => (
                <button
                  key={t}
                  className={`tab-btn ${activeTab === t ? "active" : ""}`}
                  onClick={() => setActiveTab(t)}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>

            {activeTab === "description" && (
              <div className="desc-content">
                <p>A rare 1970s gold-tone chronograph watch in exceptional condition. This timepiece features a manually-wound movement, original crown, and a sunburst dial with applied gilt indices. The case measures 37mm and shows minimal wear consistent with careful use.</p>
                <p>Comes with the original box, papers, and a newly fitted genuine leather strap. Serviced by a certified watchmaker in February 2026. The movement runs accurately at ±3 seconds per day.</p>
              </div>
            )}

            {activeTab === "specs" && (
              <div className="specs-grid">
                {[
                  ["Brand","Unsigned / Swiss"],["Movement","Manual Wind"],
                  ["Case Size","37mm"],["Case Material","Gold-Tone Stainless"],
                  ["Crystal","Acrylic"],["Condition","Like New"],
                  ["Year","c. 1972"],["Strap","Genuine Leather"],
                ].map(([k,v]) => (
                  <div className="spec-row" key={k}>
                    <span className="spec-key">{k}</span>
                    <span className="spec-val">{v}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "reviews" && (
              <>
                <div className="review-summary">
                  <div>
                    <div className="review-big-num">{PRODUCT.rating}</div>
                    <div className="review-big-stars">
                      {[1,2,3,4,5].map(s => <span key={s} style={{fontSize:"0.85rem"}}>⭐</span>)}
                    </div>
                    <div className="review-big-count">{PRODUCT.reviewCount} reviews</div>
                  </div>
                  <div className="review-bars">
                    {BAR_DATA.map(b => (
                      <div className="bar-row" key={b.stars}>
                        <span className="bar-label">{b.stars}★</span>
                        <div className="bar-track">
                          <div className="bar-fill" style={{width:`${b.pct}%`}} />
                        </div>
                        <span className="bar-pct">{b.pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="review-list">
                  {REVIEWS.map((r, i) => (
                    <div className="review-card" key={i}>
                      <div className="review-header">
                        <span className="reviewer-name">{r.name}</span>
                        <span className="reviewer-date">{r.date}</span>
                      </div>
                      <div className="review-stars">
                        {[1,2,3,4,5].map(s => <span key={s} style={{fontSize:"0.8rem"}}>{s<=r.rating?"⭐":"☆"}</span>)}
                      </div>
                      <p className="review-body">{r.body}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Similar items */}
          <div className="similar-section">
            <h2>You May Also <span>Like</span></h2>
            <div className="similar-grid">
              {SIMILAR.map((s, i) => (
                <div className="sim-card" key={i}>
                  <div className="sim-img">{s.emoji}</div>
                  <div className="sim-body">
                    <div className="sim-title">{s.title}</div>
                    <div className="sim-price">₹{s.price.toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Offer modal */}
      {offerOpen && (
        <div className="modal-overlay" onClick={() => setOfferOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Make an Offer</h3>
              <button className="modal-close" onClick={() => setOfferOpen(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div>
                <span className="modal-label">Listed Price</span>
                <div style={{fontSize:"1.3rem",fontFamily:"'Playfair Display',serif",fontWeight:700,color:"var(--amber)"}}>₹84,500</div>
              </div>
              <div>
                <span className="modal-label">Your Offer (₹) *</span>
                <input className="modal-input" type="number" placeholder="e.g. 75000" />
              </div>
              <div>
                <span className="modal-label">Message (optional)</span>
                <input className="modal-input" placeholder="Add a note to the seller..." />
              </div>
              <p style={{fontSize:"0.75rem",color:"var(--muted)",lineHeight:1.6}}>
                The seller has 48 hours to accept, reject, or counter your offer.
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn-sm-ghost" onClick={() => setOfferOpen(false)}>Cancel</button>
              <button className="btn-sm-primary" onClick={() => setOfferOpen(false)}>Send Offer</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
