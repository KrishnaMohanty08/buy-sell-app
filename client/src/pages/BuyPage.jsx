import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
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
  ArrowLeft,
} from "lucide-react";
import "../styles/globals.css";
import "../styles/pageStyles.css";
import { getListingById } from "../api/listing.js";
import { isAuthenticated } from "../api/auth.js";
import { useCartStore } from "../store/cartStore.js";
import { useToastStore } from "../store/toastStore.js";

const REVIEWS = [
  { name: "Rohan M.", date: "Apr 2026", rating: 5, body: "Absolutely stunning piece. The seller packaged it immaculately and it arrived exactly as described. Highly recommend." },
  { name: "Priya S.", date: "Mar 2026", rating: 4, body: "Great condition, matches the photos perfectly. Shipping was a bit slow but the item itself is beautiful." },
  { name: "Aarav K.", date: "Feb 2026", rating: 5, body: "Legit seller. Genuine vintage piece with original box. Worth every rupee." },
];

const SIMILAR = [
  { title: "Art Deco Bracelet", price: 12000, emoji: "💎" },
  { title: "1950s Compass",     price: 4500,  emoji: "🧭" },
  { title: "Collector's Coin Set", price: 8800, emoji: "🪙" },
  { title: "Vintage Fountain Pen", price: 3200, emoji: "🖊️" },
];

const BAR_DATA = [
  { stars: 5, pct: 72 }, { stars: 4, pct: 18 }, { stars: 3, pct: 6 },
  { stars: 2, pct: 2  }, { stars: 1, pct: 2  },
];

const CONDITION_LABELS = { NEW: "New", LIKE_NEW: "Like New", USED: "Used" };

const DEFAULT_PRODUCT = {
  title: "Product", category: "Uncategorized",
  price: 0, condition: "USED", negotiable: false,
  isActive: true, deletedAt: null, stock: 1,
  images: [], description: "",
  seller: { name: "Seller", avatar: "S", rating: 4.5, sales: 0, responseTime: "~2 hrs" },
  rating: 4.5, reviewCount: 0,
};

export default function BuyPage() {
  const navigate = useNavigate();
  // ✅ Fix: route is /buy/:id, not :listingId
  const { id: listingId } = useParams();
  const addItem = useCartStore((state) => state.addItem);
  const showSuccess = useToastStore((state) => state.success);
  const showError = useToastStore((state) => state.error);

  const [activeThumb, setActiveThumb] = useState(0);
  const [wished, setWished]           = useState(false);
  const [qty, setQty]                 = useState(1);
  const [cartAdded, setCartAdded]     = useState(false);
  const [activeTab, setActiveTab]     = useState("description");
  const [offerOpen, setOfferOpen]     = useState(false);
  const [loading, setLoading]         = useState(true);
  const [loadingCart, setLoadingCart] = useState(false);
  const [error, setError]             = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [product, setProduct]         = useState(DEFAULT_PRODUCT);

  // ── Fetch listing ──────────────────────────────────────────────────────────
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
        setProduct({
          id:          data.id,
          title:       data.title,
          description: data.description,
          brand:       data.brand || null,
          category:    data.category?.name || "Uncategorized",
          price:       data.price,
          condition:   data.condition,
          negotiable:  data.negotiable,
          isSold:      data.isSold,
          isActive:    data.isActive,
          deletedAt:   data.deletedAt,
          stock:       data.stock ?? 1,
          images:      data.images || [],
          tags:        data.tags || [],
          seller: {
            name: data.seller?.firstName
              ? `${data.seller.firstName} ${data.seller.lastName}`
              : "Seller",
            avatar: data.seller?.firstName?.charAt(0) || "S",
            rating: 4.5,
            sales: 0,
            responseTime: "~2 hrs",
          },
          // ✅ Use real review data from API
          rating:      Number(data.avgRating) || 4.5,
          reviewCount: data._count?.reviews || 0,
          reviews:     data.reviews || [],
        });
      } catch (err) {
        setError(err.message || "Failed to load listing");
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [listingId]);

  // ── Add to cart ────────────────────────────────────────────────────────────
  const handleAddCart = async () => {
    if (!isAuthenticated()) { navigate("/auth"); return; }
    if (!listingId) { setError("Listing ID not found"); return; }

    setLoadingCart(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const result = await addItem(listingId, qty, {
        id: listingId,
        title: product.title,
        description: product.description,
        brand: product.brand,
        price: product.price,
        condition: product.condition,
        negotiable: product.negotiable,
        isSold: product.isSold,
        isActive: product.isActive,
        deletedAt: product.deletedAt,
        stock: product.stock,
        images: product.images,
        category: { name: product.category },
      });
      setCartAdded(true);
      setSuccessMessage(result.message || "Item added to cart successfully!");
      showSuccess(result.message || "Item added to cart successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err.message || "Failed to add item to cart");
      showError(err.message || "Failed to add item to cart");
      setCartAdded(false);
    } finally {
      setLoadingCart(false);
    }
  };

  // ── Loading state ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
        <div style={{ textAlign: "center" }}>
          <Loader size={48} strokeWidth={2} style={{ animation: "spin 1s linear infinite", color: "#F2B949", margin: "0 auto 1rem", display: "block" }} />
          <p style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif" }}>Loading product details...</p>
        </div>
      </div>
    );
  }

  // ── Error state ────────────────────────────────────────────────────────────
  if (error && !product.title) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
        <div style={{ textAlign: "center", color: "#dc2626", fontFamily: "'DM Sans', sans-serif" }}>
          <AlertCircle size={48} style={{ margin: "0 auto 1rem", display: "block" }} />
          <p>{error}</p>
          <button onClick={() => navigate("/explore")} style={{
            marginTop: "1rem", padding: "0.5rem 1.25rem",
            background: "linear-gradient(135deg,#F2B949,#F27430)",
            color: "#1a1208", border: "none", borderRadius: "0.5rem",
            cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
          }}>
            Back to Explore
          </button>
        </div>
      </div>
    );
  }

  const currentImage = product.images?.[activeThumb]?.url || null;
  const thumbIcons   = [Watch, Search, Package, Gem];
  const maxQuantity = Math.max(1, product.stock || 1);
  const unavailableReason =
    product.deletedAt ? "This item has been removed" :
    product.isActive === false ? "This item is inactive" :
    product.isSold ? "This item has been sold" :
    product.stock < 1 ? "This item is out of stock" : null;
  const canAddToCart = !unavailableReason;

  return (
    <>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      <div className="buy-page">
        <div className="buy-inner">

          {/* Breadcrumb */}
          <div className="breadcrumb">
            <button onClick={() => navigate("/")} style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", padding: 0 }}>Home</button>
            <span>/</span>
            <button onClick={() => navigate("/explore")} style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", padding: 0 }}>Explore</button>
            <span>/</span>
            <span style={{ opacity: 0.6 }}>{product.category}</span>
            <span>/</span>
            <strong>{product.title}</strong>
          </div>

          {/* Back button */}
          <button
            onClick={() => navigate("/explore")}
            style={{
              display: "inline-flex", alignItems: "center", gap: "0.4rem",
              background: "none", border: "none", cursor: "pointer",
              color: "rgba(242,185,73,0.7)", fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.82rem", marginBottom: "1rem", padding: 0,
            }}
          >
            <ArrowLeft size={14} strokeWidth={2} /> Back to listings
          </button>

          {/* Main layout */}
          <div className="product-layout">
            {/* Gallery */}
            <div className="gallery">
              <div className="gallery-main">
                {/* Sold overlay */}
                {product.isSold && (
                  <div style={{
                    position: "absolute", inset: 0, zIndex: 10,
                    background: "rgba(0,0,0,0.6)", display: "flex",
                    alignItems: "center", justifyContent: "center",
                    borderRadius: "inherit",
                  }}>
                    <span style={{
                      background: "rgba(220,38,38,0.9)", color: "#fff",
                      fontFamily: "'DM Sans',sans-serif", fontWeight: 700,
                      fontSize: "1.2rem", padding: "0.5rem 1.5rem",
                      borderRadius: "0.5rem", letterSpacing: "0.08em",
                    }}>SOLD</span>
                  </div>
                )}

                {currentImage ? (
                  <img src={currentImage} alt={product.title} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "inherit" }} />
                ) : (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontSize: "5rem" }}>📦</div>
                )}

                <button
                  className={`card-wish ${wished ? "wished" : ""}`}
                  onClick={() => setWished(w => !w)}
                  style={{ position: "absolute", top: "1rem", right: "1rem", background: "rgba(0,0,0,0.4)", border: "none", borderRadius: "50%", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: wished ? "#ef4444" : "#fff" }}
                >
                  <Heart size={18} strokeWidth={2} fill={wished ? "currentColor" : "none"} />
                </button>
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="gallery-thumbs">
                  {product.images.map((img, i) => (
                    <div
                      key={i}
                      className={`thumb ${activeThumb === i ? "active" : ""}`}
                      onClick={() => setActiveThumb(i)}
                    >
                      <img src={img.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                  ))}
                </div>
              )}
              {product.images.length === 0 && (
                <div className="gallery-thumbs">
                  {thumbIcons.map((Icon, i) => (
                    <div key={i} className={`thumb ${activeThumb === i ? "active" : ""}`} onClick={() => setActiveThumb(i)}>
                      <Icon size={20} strokeWidth={1.5} style={{ color: "rgba(242,185,73,0.5)" }} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Info panel */}
            <div className="product-info">
              <div className="product-category-tag">{product.category}</div>
              <h1 className="product-title">{product.title}</h1>
              {product.brand && (
                <div style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.45)", fontFamily: "'DM Sans',sans-serif", marginBottom: "0.25rem" }}>
                  Brand: {product.brand}
                </div>
              )}

              <div className="product-rating-row">
                <div className="stars-row">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} size={14} strokeWidth={2} fill={s <= Math.round(product.rating) ? "currentColor" : "none"} style={{ color: "#F2B949" }} />
                  ))}
                </div>
                <span className="rating-num">{product.rating}</span>
                <span className="review-count">({product.reviewCount} reviews)</span>
              </div>

              <div className="price-row">
                <span className="price-main">₹{product.price?.toLocaleString()}</span>
                {product.negotiable && (
                  <span className="negotiable-badge">Negotiable</span>
                )}
              </div>

              <div className="condition-row">
                <span className="condition-tag">{CONDITION_LABELS[product.condition] || product.condition}</span>
              </div>

              {/* Tags */}
              {product.tags?.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginBottom: "1rem" }}>
                  {product.tags.map((tag, i) => (
                    <span key={i} style={{
                      fontSize: "0.7rem", padding: "0.2rem 0.55rem",
                      background: "rgba(242,185,73,0.08)", border: "1px solid rgba(242,185,73,0.2)",
                      borderRadius: 999, color: "rgba(242,185,73,0.65)",
                      fontFamily: "'DM Sans',sans-serif",
                    }}>{tag}</span>
                  ))}
                </div>
              )}

              {/* Qty picker */}
              <div className="qty-row">
                <span className="qty-label">Qty</span>
                <div className="qty-control">
                  <button className="qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                  <span className="qty-num">{qty}</span>
                  <button className="qty-btn" onClick={() => setQty(q => Math.min(maxQuantity, q + 1))} disabled={qty >= maxQuantity}>+</button>
                </div>
              </div>

              {/* Alerts */}
              {error && (
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", padding: "0.75rem", background: "rgba(220,38,38,0.1)", border: "1px solid rgb(220,38,38)", borderRadius: "0.5rem", color: "rgb(252,165,165)", fontSize: "0.875rem", marginBottom: "0.75rem" }}>
                  <AlertCircle size={16} strokeWidth={2} />
                  <span>{error}</span>
                </div>
              )}
              {successMessage && (
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", padding: "0.75rem", background: "rgba(34,197,94,0.1)", border: "1px solid rgb(34,197,94)", borderRadius: "0.5rem", color: "rgb(134,239,172)", fontSize: "0.875rem", marginBottom: "0.75rem" }}>
                  <BadgeCheck size={16} strokeWidth={2} />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* CTAs */}
              {canAddToCart ? (
                <>
                  <button className="btn-buy">
                    <Zap size={16} strokeWidth={2} style={{ display: "inline", verticalAlign: "-3px", marginRight: "0.35rem" }} />
                    Buy Now
                  </button>
                  <button
                    className={`btn-cart ${cartAdded ? "added" : ""}`}
                    onClick={handleAddCart}
                    disabled={loadingCart}
                  >
                    {loadingCart ? (
                      <><Loader size={16} strokeWidth={2} style={{ animation: "spin 0.8s linear infinite", display: "inline", verticalAlign: "-3px", marginRight: "0.35rem" }} />Adding...</>
                    ) : cartAdded ? (
                      <><BadgeCheck size={16} strokeWidth={2} style={{ display: "inline", verticalAlign: "-3px", marginRight: "0.35rem" }} />Added to Cart</>
                    ) : (
                      <><ShoppingCart size={16} strokeWidth={2} style={{ display: "inline", verticalAlign: "-3px", marginRight: "0.35rem" }} />Add to Cart</>
                    )}
                  </button>
                  {product.negotiable && (
                    <button className="btn-offer" onClick={() => setOfferOpen(true)}>
                      <MessageSquare size={16} strokeWidth={2} style={{ display: "inline", verticalAlign: "-3px", marginRight: "0.35rem" }} />
                      Make an Offer
                    </button>
                  )}
                </>
              ) : (
                <div style={{ padding: "0.9rem", background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.4)", borderRadius: "0.75rem", color: "rgb(252,165,165)", fontFamily: "'DM Sans',sans-serif", fontSize: "0.9rem", textAlign: "center" }}>
                  {unavailableReason}
                </div>
              )}

              {/* Trust badges */}
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

              {/* Seller card */}
              <div className="seller-card">
                <div className="seller-avatar">{product.seller.avatar}</div>
                <div className="seller-info">
                  <div className="seller-name">{product.seller.name}</div>
                  <div className="seller-meta">
                    <strong>{product.seller.rating}★</strong> · responds in {product.seller.responseTime}
                  </div>
                </div>
                <button className="btn-msg">
                  <MessageSquare size={15} strokeWidth={2} style={{ display: "inline", verticalAlign: "-2px", marginRight: "0.3rem" }} />
                  Message
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="tabs-section">
            <div className="tabs-nav">
              {["description", "reviews"].map(t => (
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
                {product.description
                  ? <p>{product.description}</p>
                  : <p style={{ color: "rgba(255,255,255,0.35)" }}>No description provided.</p>}
              </div>
            )}

            {activeTab === "reviews" && (
              <>
                {/* ✅ Fix: use `product` not the undefined `PRODUCT` */}
                <div className="review-summary">
                  <div>
                    <div className="review-big-num">{product.rating}</div>
                    <div className="review-big-stars">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} size={14} strokeWidth={2} fill="currentColor" style={{ marginRight: "0.1rem", color: "#F2B949" }} />
                      ))}
                    </div>
                    <div className="review-big-count">{product.reviewCount} reviews</div>
                  </div>
                  <div className="review-bars">
                    {BAR_DATA.map(b => (
                      <div className="bar-row" key={b.stars}>
                        <span className="bar-label">{b.stars}★</span>
                        <div className="bar-track">
                          <div className="bar-fill" style={{ width: `${b.pct}%` }} />
                        </div>
                        <span className="bar-pct">{b.pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="review-list">
                  {/* Show real reviews from API if available, else fallback to mock */}
                  {(product.reviews?.length > 0 ? product.reviews : REVIEWS).map((r, i) => (
                    <div className="review-card" key={r.id || i}>
                      <div className="review-header">
                        <span className="reviewer-name">
                          {r.user ? `${r.user.firstName} ${r.user.lastName}` : r.name}
                        </span>
                        <span className="reviewer-date">
                          {r.createdAt ? new Date(r.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" }) : r.date}
                        </span>
                      </div>
                      <div className="review-stars">
                        {[1,2,3,4,5].map(s => (
                          <Star key={s} size={13} strokeWidth={2}
                            fill={s <= r.rating ? "currentColor" : "none"}
                            style={{ color: "#F2B949" }}
                          />
                        ))}
                      </div>
                      <p className="review-body">{r.comment || r.body}</p>
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
                <div style={{ fontSize: "1.3rem", fontFamily: "'Playfair Display',serif", fontWeight: 700, color: "var(--amber)" }}>
                  ₹{product.price?.toLocaleString()}
                </div>
              </div>
              <div>
                <span className="modal-label">Your Offer (₹) *</span>
                <input className="modal-input" type="number" placeholder={`e.g. ${Math.round(product.price * 0.85)}`} />
              </div>
              <div>
                <span className="modal-label">Message (optional)</span>
                <input className="modal-input" placeholder="Add a note to the seller..." />
              </div>
              <p style={{ fontSize: "0.75rem", color: "var(--muted)", lineHeight: 1.6 }}>
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
