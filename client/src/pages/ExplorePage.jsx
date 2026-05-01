import { useState, useEffect } from "react";
import {
  BookOpen,
  Boxes,
  Camera,
  Dumbbell,
  Flame,
  Gem,
  Heart,
  LayoutGrid,
  Lamp,
  List,
  Package,
  Search,
  Shirt,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Tag,
  Watch,
  Headphones,
  Loader
} from "lucide-react";
import { getListings } from "../api/listing";
import "../styles/globals.css";
import "../styles/pageStyles.css";

const CATEGORIES = [
  { label: "All", count: 2400, icon: Boxes },
  { label: "Electronics", count: 480, icon: Smartphone },
  { label: "Fashion", count: 360, icon: Shirt },
  { label: "Home & Living", count: 290, icon: Lamp },
  { label: "Books", count: 210, icon: BookOpen },
  { label: "Sports", count: 170, icon: Dumbbell },
  { label: "Collectibles", count: 95, icon: Gem },
];

const CONDITIONS = ["New", "Like New", "Good", "Fair"];



export default function ExplorePage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeConditions, setActiveConditions] = useState([]);
  const [wished, setWished] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [activePage, setActivePage] = useState(1);
  const [activeFilters, setActiveFilters] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalListings, setTotalListings] = useState(0);

  // Fetch listings whenever filters change
  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      setError(null);
      try {
        const filters = {
          category: activeCategory !== "All" ? activeCategory : undefined,
          condition: activeConditions.length > 0 ? activeConditions[0] : undefined,
          minPrice: minPrice ? parseInt(minPrice) : undefined,
          maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
          search: searchQuery || undefined,
          sortBy: sortBy === "newest" ? "newest" : sortBy === "price_low" ? "price" : "price",
          sortOrder: sortBy === "price_high" ? "desc" : "asc",
          page: activePage,
          limit: 12,
        };

        // Remove undefined values
        Object.keys(filters).forEach(key => filters[key] === undefined && delete filters[key]);

        const response = await getListings(filters);
        setListings(response.listings || []);
        setTotalListings(response.total || 0);
      } catch (err) {
        setError(err.message);
        console.error("Failed to fetch listings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [activeCategory, activeConditions, minPrice, maxPrice, searchQuery, sortBy, activePage]);

  const toggleCondition = (c) =>
    setActiveConditions(p => p.includes(c) ? p.filter(x => x !== c) : [...p, c]);
  const toggleWish = (id) =>
    setWished(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const removeFilter = (f) => setActiveFilters(p => p.filter(x => x !== f));

  const handlePriceFilter = () => {
    if (minPrice || maxPrice) {
      const filterLabel = `₹${minPrice || "0"} - ₹${maxPrice || "∞"}`;
      if (!activeFilters.includes(filterLabel)) {
        setActiveFilters([...activeFilters, filterLabel]);
      }
    }
  };

  return (
    <>
      <div className="explore-page">
        {/* Header */}
        <div className="explore-header">
          <div className="explore-eyebrow">Marketplace</div>
          <h1 className="explore-title">Explore <span>Everything</span></h1>
          <p className="explore-subtitle">2,400+ listings across all categories</p>
        </div>

        {/* Search row */}
        <div className="search-row">
          <div className="search-wrap">
            <Search className="search-icon" size={18} strokeWidth={2} />
            <input 
              className="search-input" 
              placeholder="Search products, brands, sellers..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setActivePage(1);
              }}
            />
          </div>
          <select 
            className="sort-select"
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setActivePage(1);
            }}
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
                <button className="filter-clear">Clear all</button>
              </div>

              {/* Categories */}
              <div className="filter-section">
                <div className="filter-section-title">Category</div>
                <div className="cat-pills">
                  {CATEGORIES.map(cat => (
                    <div
                      key={cat.label}
                      className={`cat-pill ${activeCategory === cat.label ? "active" : ""}`}
                      onClick={() => setActiveCategory(cat.label)}
                    >
                      <span style={{display:"inline-flex",alignItems:"center",gap:"0.45rem"}}>{(() => { const CategoryIcon = cat.icon; return <><CategoryIcon size={14} strokeWidth={2} /> {cat.label}</>; })()}</span>
                      <span className="cat-count">{cat.count}</span>
                    </div>
                  ))}
                </div>
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
                      <span className="condition-label">{c}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="filter-section">
                <div className="filter-section-title">Price Range (₹)</div>
                <div className="price-inputs">
                  <input 
                    className="price-input" 
                    placeholder="Min" 
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                  />
                  <input 
                    className="price-input" 
                    placeholder="Max" 
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                  />
                </div>
                <button 
                  className="btn-card"
                  onClick={handlePriceFilter}
                  style={{ width: "100%", marginTop: "0.75rem" }}
                >
                  Apply
                </button>
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
                <button className={`view-btn ${viewMode === "grid" ? "active" : ""}`} onClick={() => setViewMode("grid")}><LayoutGrid size={16} strokeWidth={2} /></button>
                <button className={`view-btn ${viewMode === "list" ? "active" : ""}`} onClick={() => setViewMode("list")}><List size={16} strokeWidth={2} /></button>
              </div>
            </div>

            {/* Active filters */}
            {activeFilters.length > 0 && (
              <div className="active-filters">
                {activeFilters.map(f => (
                  <div className="filter-chip" key={f}>
                    {f}
                    <span className="chip-x" onClick={() => removeFilter(f)}>✕</span>
                  </div>
                ))}
              </div>
            )}

            {/* Loading state */}
            {loading && (
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "300px" }}>
                <Loader size={32} strokeWidth={2} className="spin" style={{ animation: "spin 1s linear infinite" }} />
              </div>
            )}

            {/* Error state */}
            {error && !loading && (
              <div style={{ padding: "2rem", textAlign: "center", color: "#dc2626" }}>
                <p>Error loading listings: {error}</p>
              </div>
            )}

            {/* Grid */}
            {!loading && !error && (
              <div className={`product-grid ${viewMode === "list" ? "list-view" : ""}`}>
                {listings.length > 0 ? listings.map((listing, i) => (
                  <div className="product-card" key={listing.id} style={{ animationDelay: `${i * 0.05}s` }}>
                    <div className="card-image">
                      <span className="card-emoji" style={{ fontSize: "3rem", display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                        📦
                      </span>
                      <div
                        className={`card-wish ${wished.includes(listing.id) ? "wished" : ""}`}
                        onClick={() => toggleWish(listing.id)}
                      >
                        <Heart size={18} strokeWidth={2} fill={wished.includes(listing.id) ? "currentColor" : "none"} />
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="card-category">{listing.category?.name || "Uncategorized"}</div>
                      <div className="card-title">{listing.title}</div>
                      <div className="card-condition">{listing.condition || "Good"}</div>
                      <div className="card-footer">
                        <div>
                          <span className="card-price">₹{listing.price?.toLocaleString()}</span>
                        </div>
                        <button className="btn-card">Add to Cart</button>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "2rem", color: "#6b7280" }}>
                    <p>No listings found. Try adjusting your filters.</p>
                  </div>
                )}
              </div>
            )}

            {/* Pagination */}
            {totalListings > 12 && !loading && (
              <div className="pagination">
                {[1, 2, 3, 4, 5].map((p) => (
                  <button
                    key={p}
                    className={`page-btn ${activePage === p ? "active" : ""}`}
                    onClick={() => setActivePage(p)}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}
