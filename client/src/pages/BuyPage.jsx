import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowUpRight,
  BadgeCheck,
  Gem,
  Heart,
  MessageSquare,
  Package,
  RotateCcw,
  Search,
  ShieldCheck,
  ShoppingCart,
  Star,
  Watch,
  Zap,
  AlertCircle,
  Loader,
} from "lucide-react";
import "../styles/globals.css";
import "../styles/pageStyles.css";
import { addToCart } from "../api/cart.js";
import { getListingById } from "../api/listing.js";
import { isAuthenticated } from "../api/auth.js";

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

const DEFAULT_PRODUCT = {
  title: "Product",
  category: "Uncategorized",
  price: 0,
  oldPrice: 0,
  condition: "Good",
  negotiable: false,
  thumbs: [Watch, Search, Package, Gem],
  seller: { name: "Seller", avatar: "S", rating: 4.5, sales: 0, responseTime: "~2 hrs" },
  rating: 4.5,
  reviewCount: 0,
  soldCount: 0,
};

export default function BuyPage() {
  const navigate = useNavigate();
  const { listingId } = useParams();
  const [activeThumb, setActiveThumb] = useState(0);
  const [wished, setWished] = useState(false);
  const [qty, setQty] = useState(1);
  const [cartAdded, setCartAdded] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [offerOpen, setOfferOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingCart, setLoadingCart] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [product, setProduct] = useState(DEFAULT_PRODUCT);

  // Fetch listing data on component mount
  useEffect(() => {
    const fetchListing = async () => {
      if (!listingId) {
        setError("No listing ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await getListingById(listingId);
        
        // Transform API response to match product structure
        setProduct({
          id: data.id,
          title: data.title,
          description: data.description,
          category: data.category?.name || "Uncategorized",
          price: data.price,
          oldPrice: data.price * 1.2, // Placeholder for old price
          condition: data.condition,
          negotiable: data.negotiable,
          thumbs: [Watch, Search, Package, Gem],
          seller: {
            name: data.seller?.firstName ? `${data.seller.firstName} ${data.seller.lastName}` : "Seller",
            avatar: data.seller?.firstName?.charAt(0) || "S",
            rating: 4.5,
            sales: 0,
            responseTime: "~2 hrs"
          },
          rating: 4.5,
          reviewCount: 0,
          soldCount: 0,
        });
      } catch (err) {
        setError(err.message || "Failed to load listing");
        console.error("Error fetching listing:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [listingId]);

  const ActiveThumb = product.thumbs ? product.thumbs[activeThumb] : Watch;

  const handleAddCart = async () => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      navigate("/auth");
      return;
    }

    if (!listingId) {
      setError("Listing ID not found");
      return;
    }

    setLoadingCart(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const result = await addToCart(listingId, qty);
      setCartAdded(true);
      setSuccessMessage(result.message || "Item added to cart successfully!");
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);

      console.log("Cart response:", result);
    } catch (err) {
      setError(err.message || "Failed to add item to cart");
      setCartAdded(false);
      console.error("Error adding to cart:", err);
    } finally {
      setLoadingCart(false);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
        <div style={{ textAlign: "center" }}>
          <Loader size={48} strokeWidth={2} style={{ animation: "spin 1s linear infinite", margin: "0 auto 1rem" }} />
          <p style={{ color: "#6b7280" }}>Loading product details...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && !product.title) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
        <div style={{ textAlign: "center", color: "#dc2626" }}>
          <AlertCircle size={48} style={{ margin: "0 auto 1rem" }} />
          <p>{error}</p>
          <button 
            onClick={() => navigate("/explore")}
            style={{ marginTop: "1rem", padding: "0.5rem 1rem", backgroundColor: "#3b82f6", color: "white", border: "none", borderRadius: "0.5rem", cursor: "pointer" }}
          >
            Back to Explore
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="buy-page">
        <div className="buy-inner">
          {/* Breadcrumb */}
          <div className="breadcrumb">
            <a>Home</a><span>/</span>
            <a>Explore</a><span>/</span>
            <a>{product.category}</a><span>/</span>
            <strong>{product.title}</strong>
          </div>

          {/* Main layout */}
          <div className="product-layout">
            {/* Gallery */}
            <div className="gallery">
              <div className="gallery-main">
                <span className="gallery-main-badge">30% OFF</span>
                <span style={{display:"inline-flex",alignItems:"center",justifyContent:"center",height:"7rem",width:"7rem"}}><ActiveThumb size={84} strokeWidth={1.7} /></span>
                <div
                  className={`gallery-main-wish ${wished ? "wished" : ""}`}
                  onClick={() => setWished(p => !p)}
                >
                  <Heart size={18} strokeWidth={2} fill={wished ? "currentColor" : "none"} />
                </div>
              </div>
              <div className="gallery-thumbs">
                {product.thumbs && product.thumbs.map((t, i) => (
                  <div
                    key={i}
                    className={`gallery-thumb ${activeThumb === i ? "active" : ""}`}
                    onClick={() => setActiveThumb(i)}
                  >
                    {(() => { const ThumbIcon = t; return <ThumbIcon size={22} strokeWidth={2} />; })()}
                  </div>
                ))}
              </div>
            </div>

            {/* Info */}
            <div className="info-panel">
              <div>
                <div className="info-category">{product.category}</div>
                <div className="info-top-row">
                  <h1 className="info-title">{product.title}</h1>
                  <button className="info-share"><ArrowUpRight size={15} strokeWidth={2} style={{display:"inline", verticalAlign:"-2px", marginRight:"0.3rem"}} />Share</button>
                </div>
              </div>

              {/* Rating */}
              <div className="rating-row">
                <div className="stars">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} size={14} strokeWidth={2} fill={s <= Math.round(product.rating) ? "currentColor" : "none"} className="star" />
                  ))}
                </div>
                <span className="rating-num">{product.rating}</span>
                <span className="rating-count">({product.reviewCount} reviews)</span>
                <span className="sold-badge">{product.soldCount} sold</span>
              </div>

              {/* Price */}
              <div className="price-block">
                <div>
                  <span className="price-main">₹{product.price.toLocaleString()}</span>
                  <span className="price-old">₹{product.oldPrice.toLocaleString()}</span>
                  <span className="price-discount">30% off</span>
                </div>
                <div className="price-sub">Inclusive of all taxes · Free shipping</div>
              </div>

              {/* Condition */}
              <div className="cond-block">
                <span className="cond-chip">{product.condition}</span>
                {product.negotiable && <span className="neg-chip">💬 Negotiable</span>}
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
                {error && (
                  <div style={{
                    display: "flex",
                    gap: "0.5rem",
                    alignItems: "center",
                    padding: "0.75rem",
                    backgroundColor: "rgba(239, 68, 68, 0.1)",
                    border: "1px solid rgb(239, 68, 68)",
                    borderRadius: "0.5rem",
                    color: "rgb(239, 68, 68)",
                    fontSize: "0.875rem",
                  }}>
                    <AlertCircle size={16} strokeWidth={2} />
                    <span>{error}</span>
                  </div>
                )}
                {successMessage && (
                  <div style={{
                    display: "flex",
                    gap: "0.5rem",
                    alignItems: "center",
                    padding: "0.75rem",
                    backgroundColor: "rgba(34, 197, 94, 0.1)",
                    border: "1px solid rgb(34, 197, 94)",
                    borderRadius: "0.5rem",
                    color: "rgb(34, 197, 94)",
                    fontSize: "0.875rem",
                  }}>
                    <BadgeCheck size={16} strokeWidth={2} />
                    <span>{successMessage}</span>
                  </div>
                )}
                <button className="btn-buy"><Zap size={16} strokeWidth={2} style={{display:"inline", verticalAlign:"-3px", marginRight:"0.35rem"}} />Buy Now</button>
                <button 
                  className={`btn-cart ${cartAdded ? "added" : ""}`} 
                  onClick={handleAddCart}
                  disabled={loadingCart}
                >
                  {loadingCart ? (
                    <>
                      <span style={{display:"inline", verticalAlign:"-3px", marginRight:"0.35rem"}}>⏳</span>
                      Adding to Cart...
                    </>
                  ) : cartAdded ? (
                    <><BadgeCheck size={16} strokeWidth={2} style={{display:"inline", verticalAlign:"-3px", marginRight:"0.35rem"}} />Added to Cart</>
                  ) : (
                    <><ShoppingCart size={16} strokeWidth={2} style={{display:"inline", verticalAlign:"-3px", marginRight:"0.35rem"}} />Add to Cart</>
                  )}
                </button>
                {product.negotiable && (
                  <button className="btn-offer" onClick={() => setOfferOpen(true)}>
                    <MessageSquare size={16} strokeWidth={2} style={{display:"inline", verticalAlign:"-3px", marginRight:"0.35rem"}} />Make an Offer
                  </button>
                )}
              </div>

              {/* Trust */}
              <div className="trust-row">
                <div className="trust-item">
                  <div className="trust-icon"><ShieldCheck size={22} strokeWidth={2} /></div>
                  <div className="trust-label">Buyer<br/>Protection</div>
                </div>
                <div className="trust-item">
                  <div className="trust-icon"><RotateCcw size={22} strokeWidth={2} /></div>
                  <div className="trust-label">Easy<br/>Returns</div>
                </div>
                <div className="trust-item">
                  <div className="trust-icon"><BadgeCheck size={22} strokeWidth={2} /></div>
                  <div className="trust-label">Verified<br/>Seller</div>
                </div>
              </div>

              <div className="divider" />

              {/* Seller */}
              <div className="seller-card">
                <div className="seller-avatar">{product.seller.avatar}</div>
                <div className="seller-info">
                  <div className="seller-name">{product.seller.name}</div>
                  <div className="seller-meta">
                    <strong>{product.seller.rating}★</strong> · {product.seller.sales} sales · responds in {product.seller.responseTime}
                  </div>
                </div>
                <button className="btn-msg"><MessageSquare size={15} strokeWidth={2} style={{display:"inline", verticalAlign:"-2px", marginRight:"0.3rem"}} />Message</button>
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
                      {[1,2,3,4,5].map(s => <Star key={s} size={14} strokeWidth={2} fill="currentColor" style={{marginRight:"0.1rem"}} />)}
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
                        {[1,2,3,4,5].map(s => <Star key={s} size={13} strokeWidth={2} fill={s<=r.rating ? "currentColor" : "none"} />)}
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
