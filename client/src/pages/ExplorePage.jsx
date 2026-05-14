import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart, LayoutGrid, List, Search, Loader, ShoppingCart, BadgeCheck, X
} from "lucide-react";
import { getListings } from "../api/listing";
import { isAuthenticated } from "../api/auth";
import { useCartStore } from "../store/cartStore";
import "../styles/globals.css";
import "../styles/pageStyles.css";

const CONDITIONS = ["NEW", "LIKE_NEW", "USED"];
const CONDITION_LABELS = { NEW: "New", LIKE_NEW: "Like New", USED: "Used" };

// ── Toast notification ──────────────────────────────────────────────────────
function Toast({ toasts, onDismiss }) {
  return (
    <div style={{
      position: "fixed", bottom: "1.5rem", right: "1.5rem",
      display: "flex", flexDirection: "column", gap: "0.5rem", zIndex: 9999,
    }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          display: "flex", alignItems: "center", gap: "0.6rem",
          padding: "0.75rem 1rem",
          background: t.type === "success" ? "rgba(22,163,74,0.15)" : "rgba(220,38,38,0.15)",
          border: `1px solid ${t.type === "success" ? "rgb(34,197,94)" : "rgb(220,38,38)"}`,
          borderRadius: "0.75rem", backdropFilter: "blur(8px)",
          color: t.type === "success" ? "rgb(134,239,172)" : "rgb(252,165,165)",
          fontSize: "0.82rem", fontFamily: "'DM Sans', sans-serif",
          minWidth: "220px", maxWidth: "320px",
          animation: "slideInRight 0.25s ease",
        }}>
          {t.type === "success"
            ? <BadgeCheck size={15} strokeWidth={2} style={{ flexShrink: 0 }} />
            : <X size={15} strokeWidth={2} style={{ flexShrink: 0 }} />}
          <span style={{ flex: 1 }}>{t.message}</span>
          <button onClick={() => onDismiss(t.id)} style={{
            background: "none", border: "none", cursor: "pointer",
            color: "inherit", padding: 0, opacity: 0.6, lineHeight: 1,
          }}>✕</button>
        </div>
      ))}
    </div>
  );
}

export default function ExplorePage() {
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);

  // — filter state —
  const [activeConditions, setActiveConditions] = useState([]);
  const [minPrice, setMinPrice]   = useState("");
  const [maxPrice, setMaxPrice]   = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy]       = useState("newest");
  const [activePage, setActivePage] = useState(1);
  const [viewMode, setViewMode]   = useState("grid");

  // — data state —
  const [listings, setListings]       = useState([]);
  const [totalListings, setTotalListings] = useState(0);
  const [totalPages, setTotalPages]   = useState(1);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState(null);

  // — UI state —
  const [wished, setWished]             = useState([]);
  const [cartLoading, setCartLoading]   = useState({}); // { [listingId]: bool }
  const [cartAdded, setCartAdded]       = useState({}); // { [listingId]: bool }
  const [toasts, setToasts]             = useState([]);

  // ── toast helpers ─────────────────────────────────────────────────────────
  const addToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts(p => [...p, { id, message, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
  }, []);

  const dismissToast = (id) => setToasts(p => p.filter(t => t.id !== id));

  // ── fetch listings ────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      setError(null);
      try {
        const sortOrder =
          sortBy === "price_high" ? "desc" :
          sortBy === "price_low"  ? "asc"  : "desc";
        const sortField =
          sortBy === "price_high" || sortBy === "price_low" ? "price" : "newest";

        const filters = {
          ...(activeConditions.length > 0 && { condition: activeConditions[0] }),
          ...(minPrice && { minPrice: parseInt(minPrice) }),
          ...(maxPrice && { maxPrice: parseInt(maxPrice) }),
          ...(searchQuery && { search: searchQuery }),
          sortBy: sortField,
          sortOrder,
          page: activePage,
          limit: 12,
        };

        const response = await getListings(filters);
        setListings(response.listings || []);
        setTotalListings(response.pagination?.total || 0);
        setTotalPages(response.pagination?.totalPages || 1);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, [activeConditions, minPrice, maxPrice, searchQuery, sortBy, activePage]);

  // ── handlers ─────────────────────────────────────────────────────────────
  const toggleCondition = (c) => {
    setActiveConditions(p =>
      p.includes(c) ? p.filter(x => x !== c) : [...p, c]
    );
    setActivePage(1);
  };

  const toggleWish = (id) =>
    setWished(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  const handleAddToCart = async (e, listing) => {
    e.stopPropagation();
    const listingId = listing.id;

    if (!isAuthenticated()) {
      navigate("/auth");
      return;
    }

    setCartLoading(p => ({ ...p, [listingId]: true }));
    try {
      const result = await addItem(listingId, 1, listing);
      setCartAdded(p => ({ ...p, [listingId]: true }));
      addToast(result.message || "Added to cart!");
      // Reset the "added" state after 3s so button returns to normal
      setTimeout(() => setCartAdded(p => ({ ...p, [listingId]: false })), 3000);
    } catch (err) {
      addToast(err.message || "Failed to add to cart", "error");
    } finally {
      setCartLoading(p => ({ ...p, [listingId]: false }));
    }
  };

  const clearFilters = () => {
    setActiveConditions([]);
    setMinPrice("");
    setMaxPrice("");
    setSearchQuery("");
    setSortBy("newest");
    setActivePage(1);
  };

  const hasActiveFilters =
    activeConditions.length > 0 || minPrice || maxPrice;

  // ── render ────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(1rem); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .card-actions { display: flex; gap: 0.5rem; align-items: center; }
        .btn-add-cart {
          display: inline-flex; align-items: center; gap: 0.35rem;
          padding: 0.4rem 0.75rem;
          background: linear-gradient(135deg, #F2B949, #F27430);
          border: none; border-radius: 6px;
          font-family: 'DM Sans', sans-serif; font-size: 0.75rem; font-weight: 500;
          color: #1a1208; cursor: pointer;
          transition: opacity 0.2s, transform 0.15s;
          flex-shrink: 0;
        }
        .btn-add-cart:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
        .btn-add-cart:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }
        .btn-add-cart.added {
          background: linear-gradient(135deg, #22c55e, #16a34a);
          color: #fff;
        }
        .btn-view {
          display: inline-flex; align-items: center;
          padding: 0.4rem 0.75rem;
          background: transparent;
          border: 1px solid rgba(242,185,73,0.35); border-radius: 6px;
          font-family: 'DM Sans', sans-serif; font-size: 0.75rem; font-weight: 500;
          color: rgba(242,185,73,0.85); cursor: pointer;
          transition: background 0.2s, border-color 0.2s;
          flex-shrink: 0;
        }
        .btn-view:hover { background: rgba(242,185,73,0.08); border-color: rgba(242,185,73,0.6); }
        .page-nums { display: flex; gap: 0.4rem; align-items: center; }
        .page-ellipsis { color: rgba(255,255,255,0.3); font-size: 0.85rem; padding: 0 0.25rem; }
      `}</style>

      <Toast toasts={toasts} onDismiss={dismissToast} />

      <div className="explore-page">
        {/* Header */}
        <div className="explore-header">
          <div className="explore-eyebrow">Marketplace</div>
          <h1 className="explore-title">Explore <span>Everything</span></h1>
          <p className="explore-subtitle">
            {totalListings > 0 ? `${totalListings.toLocaleString()} listings available` : "Browse all listings"}
          </p>
        </div>

        {/* Search + Sort row */}
        <div className="search-row">
          <div className="search-wrap">
            <Search className="search-icon" size={18} strokeWidth={2} />
            <input
              className="search-input"
              placeholder="Search products, brands, sellers..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setActivePage(1); }}
            />
          </div>
          <select
            className="sort-select"
            value={sortBy}
            onChange={(e) => { setSortBy(e.target.value); setActivePage(1); }}
          >
            <option value="newest">Sort: Newest</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
          </select>
        </div>

        {/* Layout */}
        <div className="explore-layout">
          {/* Sidebar */}
          <aside className="sidebar">
            <div className="filter-card">
              <div className="filter-header">
                <h3>Filters</h3>
                {hasActiveFilters && (
                  <button className="filter-clear" onClick={clearFilters}>Clear all</button>
                )}
              </div>

              {/* Condition */}
              <div className="filter-section">
                <div className="filter-section-title">Condition</div>
                <div className="condition-list">
                  {CONDITIONS.map(c => (
                    <div
                      key={c}
                      className={`condition-item ${activeConditions.includes(c) ? "checked" : ""}`}
                      onClick={() => toggleCondition(c)}
                    >
                      <div className="custom-check">
                        {activeConditions.includes(c) && <div className="check-dot" />}
                      </div>
                      <span className="condition-label">{CONDITION_LABELS[c]}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="filter-section">
                <div className="filter-section-title">Price Range (₹)</div>
                <div className="price-inputs">
                  <input
                    className="price-input" placeholder="Min" type="number"
                    value={minPrice}
                    onChange={(e) => { setMinPrice(e.target.value); setActivePage(1); }}
                  />
                  <input
                    className="price-input" placeholder="Max" type="number"
                    value={maxPrice}
                    onChange={(e) => { setMaxPrice(e.target.value); setActivePage(1); }}
                  />
                </div>
              </div>
            </div>
          </aside>

          {/* Main */}
          <main>
            {/* Results bar */}
            <div className="results-bar">
              <div className="results-count">
                Showing <strong>{listings.length}</strong> of <strong>{totalListings}</strong> results
              </div>
              <div className="view-toggle">
                <button className={`view-btn ${viewMode === "grid" ? "active" : ""}`} onClick={() => setViewMode("grid")}>
                  <LayoutGrid size={16} strokeWidth={2} />
                </button>
                <button className={`view-btn ${viewMode === "list" ? "active" : ""}`} onClick={() => setViewMode("list")}>
                  <List size={16} strokeWidth={2} />
                </button>
              </div>
            </div>

            {/* Loading */}
            {loading && (
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "300px" }}>
                <Loader size={32} strokeWidth={2} style={{ animation: "spin 1s linear infinite", color: "#F2B949" }} />
              </div>
            )}

            {/* Error */}
            {error && !loading && (
              <div style={{ padding: "2rem", textAlign: "center", color: "#f87171", fontFamily: "'DM Sans', sans-serif" }}>
                <p>Error loading listings: {error}</p>
              </div>
            )}

            {/* Grid / List */}
            {!loading && !error && (
              <div className={`product-grid ${viewMode === "list" ? "list-view" : ""}`}>
                {listings.length > 0 ? listings.map((listing, i) => (
                  <div
                    className="product-card"
                    key={listing.id}
                    style={{ animationDelay: `${i * 0.04}s`, cursor: "pointer" }}
                    onClick={() => navigate(`/buy/${listing.id}`)}
                  >
                    <div className="card-image">
                      {/* Image or placeholder */}
                      {listing.images?.[0]?.url ? (
                        <img
                          src={listing.images[0].url}
                          alt={listing.title}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      ) : (
                        <span style={{ fontSize: "3rem", display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                          📦
                        </span>
                      )}
                      {/* Wishlist */}
                      <div
                        className={`card-wish ${wished.includes(listing.id) ? "wished" : ""}`}
                        onClick={(e) => { e.stopPropagation(); toggleWish(listing.id); }}
                      >
                        <Heart size={18} strokeWidth={2} fill={wished.includes(listing.id) ? "currentColor" : "none"} />
                      </div>
                      {/* Sold badge */}
                      {listing.isSold && (
                        <div style={{
                          position: "absolute", top: "0.5rem", left: "0.5rem",
                          background: "rgba(220,38,38,0.85)", color: "#fff",
                          fontSize: "0.65rem", fontWeight: 600, padding: "0.2rem 0.5rem",
                          borderRadius: 4, fontFamily: "'DM Sans', sans-serif",
                          textTransform: "uppercase", letterSpacing: "0.05em",
                        }}>Sold</div>
                      )}
                    </div>

                    <div className="card-body">
                      <div className="card-category">{listing.category?.name || "Uncategorized"}</div>
                      <div className="card-title">{listing.title}</div>
                      <div className="card-condition">
                        {CONDITION_LABELS[listing.condition] || listing.condition}
                        {listing.negotiable && (
                          <span style={{
                            marginLeft: "0.4rem", fontSize: "0.65rem",
                            color: "rgba(242,185,73,0.7)", fontWeight: 500,
                          }}>· Negotiable</span>
                        )}
                      </div>
                      <div className="card-footer">
                        <span className="card-price">₹{listing.price?.toLocaleString()}</span>
                        <div className="card-actions" onClick={e => e.stopPropagation()}>
                          <button
                            className="btn-view"
                            onClick={() => navigate(`/buy/${listing.id}`)}
                          >
                            View
                          </button>
                          {!listing.isSold && listing.isActive !== false && !listing.deletedAt && (listing.stock ?? 1) > 0 && (
                            <button
                              className={`btn-add-cart ${cartAdded[listing.id] ? "added" : ""}`}
                              onClick={(e) => handleAddToCart(e, listing)}
                              disabled={cartLoading[listing.id]}
                            >
                              {cartLoading[listing.id] ? (
                                <Loader size={12} strokeWidth={2} style={{ animation: "spin 0.8s linear infinite" }} />
                              ) : cartAdded[listing.id] ? (
                                <><BadgeCheck size={12} strokeWidth={2} /> Added</>
                              ) : (
                                <><ShoppingCart size={12} strokeWidth={2} /> Add</>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "3rem", color: "rgba(255,255,255,0.35)", fontFamily: "'DM Sans', sans-serif" }}>
                    <p style={{ fontSize: "1rem" }}>No listings found.</p>
                    <p style={{ fontSize: "0.85rem", marginTop: "0.5rem" }}>Try adjusting your filters or search query.</p>
                  </div>
                )}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && !loading && (
              <div className="pagination">
                <button
                  className="page-btn"
                  disabled={activePage === 1}
                  onClick={() => setActivePage(p => p - 1)}
                  style={{ opacity: activePage === 1 ? 0.35 : 1 }}
                >
                  ‹
                </button>
                <div className="page-nums">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(p => p === 1 || p === totalPages || Math.abs(p - activePage) <= 1)
                    .reduce((acc, p, idx, arr) => {
                      if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((p, idx) =>
                      p === "..." ? (
                        <span key={`ellipsis-${idx}`} className="page-ellipsis">…</span>
                      ) : (
                        <button
                          key={p}
                          className={`page-btn ${activePage === p ? "active" : ""}`}
                          onClick={() => setActivePage(p)}
                        >
                          {p}
                        </button>
                      )
                    )}
                </div>
                <button
                  className="page-btn"
                  disabled={activePage === totalPages}
                  onClick={() => setActivePage(p => p + 1)}
                  style={{ opacity: activePage === totalPages ? 0.35 : 1 }}
                >
                  ›
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}
