import { useState, useEffect } from "react";
import '../styles/globals.css';
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";
import ProfileDropdown from "./ProfileDropdown";
import CartIcon from "./CartIcon";
import NavbarLoader from "./NavbarLoader";
import { logout as logoutUser } from "../api/auth";

const NAV_LINKS = [
  { label: "Shop", href: "/buy" },
  { label: "Sell", href: "/sell" },
  { label: "Explore", href: "/explore" },
  { label: "About", href: "/about" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading, logout: logoutContext } = useUser();

  // Fetch cart count when user is authenticated
  useEffect(() => {
    if (user && user.id) {
      // TODO: Fetch cart count from API
      // For now, using mock data
      setCartCount(0);
    } else {
      setCartCount(0);
    }
  }, [user]);

  // Close mobile menu when navigating
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    logoutUser();
    logoutContext();
    navigate('/');
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleNavClick = (href) => {
    navigate(href);
  };

  // Show loader while authenticating
  if (loading) {
    return <NavbarLoader />;
  }

  return (
    <nav className="nav-root">
      {/* Logo */}
      <button
        className="nav-logo-btn"
        onClick={handleLogoClick}
        aria-label="BAZAAR Home"
      >
        <span className="nav-logo">BaZaaR</span>
      </button>

      {/* Desktop Navigation Links */}
      <ul className="nav-links">
        {NAV_LINKS.map((item) => (
          <li key={item.label}>
            <button
              className={`nav-link ${location.pathname === item.href ? 'active' : ''}`}
              onClick={() => handleNavClick(item.href)}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>

      {/* Actions Section */}
      <div className="nav-actions">
        {/* Search Icon */}
        <button className="nav-icon-btn" title="Search" aria-label="Search">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="6.5" cy="6.5" r="5" />
            <line x1="10.5" y1="10.5" x2="14" y2="14" />
          </svg>
        </button>

        {/* Wishlist Icon - Only for logged-in users */}
        {user && (
          <button className="nav-icon-btn" title="Wishlist" aria-label="Wishlist">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        )}

        {/* Cart Icon - Only for logged-in users */}
        {user && <CartIcon count={cartCount} />}

        {/* Authentication Section */}
        {user ? (
          // Logged In: Profile Dropdown + Cart
          <ProfileDropdown user={user} onLogout={handleLogout} />
        ) : (
          // Not Logged In: Sign In Button
          <button className="nav-cta" onClick={() => navigate('/auth')}>
            Sign in
          </button>
        )}

        {/* Mobile Menu Toggle */}
        <button
          className={`nav-mobile-toggle ${mobileMenuOpen ? 'open' : ''}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="nav-mobile-menu">
          <ul className="nav-mobile-links">
            {NAV_LINKS.map((item) => (
              <li key={item.label}>
                <button
                  className={`nav-mobile-link ${location.pathname === item.href ? 'active' : ''}`}
                  onClick={() => handleNavClick(item.href)}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>

          {/* Mobile Auth Section */}
          {!user && (
            <button className="nav-mobile-cta" onClick={() => navigate('/auth')}>
              Sign in
            </button>
          )}
        </div>
      )}
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
          {NAV_LINKS.map((item) => (
            <button
              key={item.label}
              className="nav-link"
              style={{ textAlign: "left", fontSize: "0.9rem" }}
              onClick={() => {
                navigate(item.href);
                setMenuOpen(false);
              }}
            >
              {item.label}
            </button>
          ))}
          {user && (
            <button
              className="nav-link"
              style={{ textAlign: "left", fontSize: "0.9rem", color: "#ff6b6b" }}
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
            >
              Logout
            </button>
          )}
        </div>
      )}
    </>
  );
}
