import { useState, useEffect } from "react";
import '../styles/globals.css';
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";
import ProfileDropdown from "./ProfileDropdown";
import CartIcon from "./CartIcon";
import NavbarLoader from "./NavbarLoader";
import { logout as logoutUser } from "../api/auth";
import { useCartStore } from "../store/cartStore";

const NAV_LINKS = [
  { label: "Sell", href: "/sell" },
  { label: "Explore", href: "/explore" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading, logout: logoutContext } = useUser();
  const cartCount = useCartStore((state) => state.totals.itemCount);
  const fetchCart = useCartStore((state) => state.fetchCart);
  const resetCart = useCartStore((state) => state.resetCart);
  const openCartDrawer = useCartStore((state) => state.openDrawer);

  useEffect(() => {
    if (user && user.id) {
      fetchCart().catch(() => {});
    } else {
      resetCart();
    }
  }, [fetchCart, resetCart, user]);

  const handleLogout = () => {
    logoutUser();
    logoutContext();
    resetCart();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const handleLogoClick = () => {
    setMobileMenuOpen(false);
    navigate('/');
  };

  const handleNavClick = (href) => {
    setMobileMenuOpen(false);
    navigate(href);
  };

  const handleCartClick = () => {
    setMobileMenuOpen(false);
    openCartDrawer();
  };

  if (loading) {
    return <NavbarLoader />;
  }

  return (
    <nav className="h-16 flex items-center justify-between px-4 md:px-8 bg-brown-900/95 border-b border-gold-400/20 font-dm-sans backdrop-blur-sm relative z-40">
      {/* Logo */}
      <button
        className="flex items-center hover:opacity-80 transition-opacity flex-shrink-0"
        onClick={handleLogoClick}
        aria-label="BAZAAR Home"
      >
        <span className="text-xl md:text-2xl font-playfair font-semibold bg-gradient-to-r from-gold-400 to-gold-300 bg-clip-text text-transparent tracking-wide">
          BaZaaR
        </span>
      </button>

      {/* Desktop Navigation Links */}
      <ul className="hidden md:flex list-none gap-8 m-0 p-0 absolute left-1/2 transform -translate-x-1/2">
        {NAV_LINKS.map((item) => (
          <li key={item.label}>
            <button
              className={`text-sm font-medium transition-colors ${
                location.pathname === item.href
                  ? 'text-gold-400'
                  : 'text-gray-300 hover:text-gold-400'
              }`}
              onClick={() => handleNavClick(item.href)}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>

      {/* Actions Section */}
      <div className="flex items-center gap-2 md:gap-3 ml-auto">
        {/* Search Icon */}
        <button className="p-2 hover:text-gold-400 text-gray-300 transition-colors flex-shrink-0" title="Search" aria-label="Search">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="6.5" cy="6.5" r="5" />
            <line x1="10.5" y1="10.5" x2="14" y2="14" />
          </svg>
        </button>

        {/* Wishlist Icon - Only for logged-in users */}
        {user && (
          <button className="p-2 hover:text-gold-400 text-gray-300 transition-colors flex-shrink-0" title="Wishlist" aria-label="Wishlist">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        )}

        {/* Cart Icon - Only for logged-in users */}
        {user && <CartIcon count={cartCount} onClick={handleCartClick} />}

        {/* Authentication Section */}
        {user ? (
          <ProfileDropdown user={user} onLogout={handleLogout} />
        ) : (
          <button className="hidden md:inline-block px-4 py-2 bg-gold-400 text-brown-900 rounded-lg font-medium hover:bg-gold-300 transition-colors text-sm flex-shrink-0" onClick={() => navigate('/auth')}>
            Sign in
          </button>
        )}

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden flex flex-col gap-1.5 items-center justify-center p-2 hover:opacity-70 transition-opacity flex-shrink-0"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
        >
          <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-brown-900/98 border-b border-gold-400/20 backdrop-blur-sm z-50 md:hidden animate-fade-up">
          <ul className="flex flex-col gap-1 p-4 list-none m-0">
            {NAV_LINKS.map((item) => (
              <li key={item.label}>
                <button
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm ${
                    location.pathname === item.href
                      ? 'bg-gold-400/15 text-gold-400'
                      : 'text-gray-300 hover:bg-gold-400/10 hover:text-gold-400'
                  }`}
                  onClick={() => handleNavClick(item.href)}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>

          {!user && (
            <div className="p-4">
              <button className="w-full px-4 py-2 bg-gold-400 text-brown-900 rounded-lg font-medium hover:bg-gold-300 transition-colors text-sm" onClick={() => navigate('/auth')}>
                Sign in
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
