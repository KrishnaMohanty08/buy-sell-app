import { useState } from "react";
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
  Headphones
} from "lucide-react";
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

const PRODUCTS = [
  { id:1, title:"Vintage Chronograph Watch", category:"Collectibles", condition:"Like New", price:84500, oldPrice:120000, icon: Watch, badge:"hot" },
  { id:3, title:"Leather Crossbody Bag", category:"Fashion", condition:"Like New", price:3800, icon: ShoppingBag, badge:"new" },
  { id:4, title:"Minimalist Floor Lamp", category:"Home & Living", condition:"Good", price:2200, icon: Lamp },
  { id:5, title:"First Edition Hardcover Set", category:"Books", condition:"Good", price:1600, icon: BookOpen, badge:"hot" },
  { id:6, title:"Canon EOS R6 Camera", category:"Electronics", condition:"Like New", price:89000, oldPrice:109000, icon: Camera, badge:"sale" },
  { id:7, title:"Marble Chess Set", category:"Collectibles", condition:"New", price:4500, icon: Gem, badge:"new" },
  { id:8, title:"Yoga Mat Pro Bundle", category:"Sports", condition:"New", price:1899, icon: Dumbbell, badge:"new" },
  { id:9, title:"Teak Dining Chair (Set of 4)", category:"Home & Living", condition:"Good", price:12000, oldPrice:18000, icon: Package, badge:"sale" },
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
            <Search className="search-icon" size={18} strokeWidth={2} />
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

            {/* Grid */}
            <div className={`product-grid ${viewMode === "list" ? "list-view" : ""}`}>
              {PRODUCTS.map((p, i) => (
                <div className="product-card" key={p.id} style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className="card-image">
                    {p.badge && (
                      <span className={`card-badge badge-${p.badge}`}>
                        {p.badge === "hot" ? <><Flame size={12} strokeWidth={2} style={{display:"inline", verticalAlign:"-2px"}} /> Hot</> : p.badge === "sale" ? <><Tag size={12} strokeWidth={2} style={{display:"inline", verticalAlign:"-2px"}} /> Sale</> : <><Sparkles size={12} strokeWidth={2} style={{display:"inline", verticalAlign:"-2px"}} /> New</>}
                      </span>
                    )}
                    <span className="card-emoji">{(() => { const ProductIcon = p.icon; return <ProductIcon size={56} strokeWidth={1.7} />; })()}</span>
                    <div
                      className={`card-wish ${wished.includes(p.id) ? "wished" : ""}`}
                      onClick={() => toggleWish(p.id)}
                    >
                      <Heart size={18} strokeWidth={2} fill={wished.includes(p.id) ? "currentColor" : "none"} />
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
