import { useState } from "react";
import "../styles/globals.css";
import "../styles/pageStyles.css";

const CATEGORIES = [
  { label: "All",        count: 2400, icon: "✦" },
  { label: "Electronics", count: 480,  icon: "📱" },
  { label: "Fashion",    count: 360,  icon: "👗" },
  { label: "Home & Living", count: 290, icon: "🏡" },
  { label: "Books",      count: 210,  icon: "📚" },
  { label: "Sports",     count: 170,  icon: "⚡" },
  { label: "Collectibles", count: 95, icon: "🪙" },
];

const CONDITIONS = ["New", "Like New", "Good", "Fair"];

const PRODUCTS = [
  { id:1, title:"Vintage Chronograph Watch", category:"Collectibles", condition:"Like New", price:84500, oldPrice:120000, emoji:"⌚", badge:"hot" },
  { id:2, title:"Sony WH-1000XM5 Headphones", category:"Electronics", condition:"New", price:24999, oldPrice:34990, emoji:"🎧", badge:"sale" },
  { id:3, title:"Leather Crossbody Bag", category:"Fashion", condition:"Like New", price:3800, emoji:"👜", badge:"new" },
  { id:4, title:"Minimalist Floor Lamp", category:"Home & Living", condition:"Good", price:2200, emoji:"💡" },
  { id:5, title:"First Edition Hardcover Set", category:"Books", condition:"Good", price:1600, emoji:"📚", badge:"hot" },
  { id:6, title:"Canon EOS R6 Camera", category:"Electronics", condition:"Like New", price:89000, oldPrice:109000, emoji:"📷", badge:"sale" },
  { id:7, title:"Marble Chess Set", category:"Collectibles", condition:"New", price:4500, emoji:"♟️", badge:"new" },
  { id:8, title:"Yoga Mat Pro Bundle", category:"Sports", condition:"New", price:1899, emoji:"🧘", badge:"new" },
  { id:9, title:"Teak Dining Chair (Set of 4)", category:"Home & Living", condition:"Good", price:12000, oldPrice:18000, emoji:"🪑", badge:"sale" },
];

export default function ExplorePage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeConditions, setActiveConditions] = useState([]);
  const [wished, setWished] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [activePage, setActivePage] = useState(1);
  const [activeFilters, setActiveFilters] = useState(["Under ₹50,000"]);

  const toggleCondition = (c) =>
    setActiveConditions(p => p.includes(c) ? p.filter(x => x !== c) : [...p, c]);
  const toggleWish = (id) =>
    setWished(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const removeFilter = (f) => setActiveFilters(p => p.filter(x => x !== f));

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
            <span className="search-icon">🔍</span>
            <input className="search-input" placeholder="Search products, brands, sellers..." />
          </div>
          <select className="sort-select">
            <option>Sort: Newest</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Most Popular</option>
            <option>Top Rated</option>
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
                      <span>{cat.icon} {cat.label}</span>
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
                  <input className="price-input" placeholder="Min" type="number" />
                  <input className="price-input" placeholder="Max" type="number" />
                </div>
              </div>
            </div>
          </aside>

          {/* Main */}
          <main>
            {/* Results bar */}
            <div className="results-bar">
              <div className="results-count">
                Showing <strong>9</strong> of <strong>2,400</strong> results
              </div>
              <div className="view-toggle">
                <button className={`view-btn ${viewMode === "grid" ? "active" : ""}`} onClick={() => setViewMode("grid")}>⊞</button>
                <button className={`view-btn ${viewMode === "list" ? "active" : ""}`} onClick={() => setViewMode("list")}>☰</button>
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

            {/* Grid */}
            <div className={`product-grid ${viewMode === "list" ? "list-view" : ""}`}>
              {PRODUCTS.map((p, i) => (
                <div className="product-card" key={p.id} style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className="card-image">
                    {p.badge && (
                      <span className={`card-badge badge-${p.badge}`}>
                        {p.badge === "hot" ? "🔥 Hot" : p.badge === "sale" ? "Sale" : "New"}
                      </span>
                    )}
                    <span className="card-emoji">{p.emoji}</span>
                    <div
                      className={`card-wish ${wished.includes(p.id) ? "wished" : ""}`}
                      onClick={() => toggleWish(p.id)}
                    >
                      {wished.includes(p.id) ? "❤️" : "🤍"}
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="card-category">{p.category}</div>
                    <div className="card-title">{p.title}</div>
                    <div className="card-condition">{p.condition}</div>
                    <div className="card-footer">
                      <div>
                        {p.oldPrice && <span className="card-old-price">₹{p.oldPrice.toLocaleString()}</span>}
                        <span className="card-price">₹{p.price.toLocaleString()}</span>
                      </div>
                      <button className="btn-card">Add to Cart</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="pagination">
              {[1,2,3,"...",12].map((p, i) => (
                <button
                  key={i}
                  className={`page-btn ${activePage === p ? "active" : ""}`}
                  onClick={() => typeof p === "number" && setActivePage(p)}
                >
                  {p}
                </button>
              ))}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
