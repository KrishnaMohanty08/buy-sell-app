import { useState } from "react";
import '../styles/globals.css';
import { useNavigate } from "react-router-dom";

const NAV_LINKS = [
  {
    "label": "Shop",
    "href": "/buy"
  },
  {
    "label": "Sell",
    "href": "/sell"
  },
  {
    "label": "Explore",
    "href": "/explore"
  },
  {
    "label": "Drops",
    "href": "/drops"
  },
  {
    "label": "About",
    "href": "/about"
  }
];

export default function Navbar({ cartCount = 3 }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate=useNavigate();
  return (
    <>
      <nav className="nav-root">
        {/* Logo */}
        <span className="nav-logo">BaZaaR</span>

        {/* Desktop links */}
        <ul className="nav-links">
          {NAV_LINKS.map((item) => (
            <li key={item.label}>
              <button className="nav-link" onClick={()=>{item.href}}>{item.label}</button>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          {/* Search */}
          <button className="nav-icon-btn" title="Search">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="6.5" cy="6.5" r="5" />
              <line x1="10.5" y1="10.5" x2="14" y2="14" />
            </svg>
          </button>

          {/* Wishlist */}
          <button className="nav-icon-btn" title="Wishlist">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M8 13.5S1.5 9.5 1.5 5.5a3 3 0 015-2.24A3 3 0 0114.5 5.5c0 4-6.5 8-6.5 8z" />
            </svg>
          </button>

          {/* Cart */}
          <button className="nav-icon-btn" title="Cart">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M1.5 1.5h1.8l1.8 8h7.4l1.5-5H4.5" />
              <circle cx="6.5" cy="12.5" r="1" fill="currentColor" stroke="none" />
              <circle cx="11.5" cy="12.5" r="1" fill="currentColor" stroke="none" />
            </svg>
            {cartCount > 0 && <span className="nav-badge">{cartCount}</span>}
          </button>

          <button className="nav-cta" onClick={()=>navigate('/auth')}>Sign in</button>

          {/* Mobile hamburger */}
          <button
            className="nav-mobile-toggle"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          style={{
            background: "rgba(26,18,8,0.97)",
            borderBottom: "0.5px solid rgba(242,185,73,0.18)",
            padding: "1rem 1.25rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {NAV_LINKS.map((label) => (
            <button
              key={label}
              className="nav-link"
              style={{ textAlign: "left", fontSize: "0.9rem" }}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
