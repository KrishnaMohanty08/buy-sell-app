import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/globals.css';

export default function ProfileDropdown({ user, onLogout }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const initials = user && `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase();
  const displayName = user ? `${user.firstName} ${user.lastName}` : 'User';

  const handleMenuItemClick = (action) => {
    setIsOpen(false);

    switch (action) {
      case 'profile':
        navigate('/profile');
        break;
      case 'listings':
        navigate('/profile?tab=listings');
        break;
      case 'orders':
        navigate('/profile?tab=orders');
        break;
      case 'wishlist':
        navigate('/profile?tab=wishlist');
        break;
      case 'logout':
        onLogout();
        break;
      default:
        break;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar Button */}
      <button
        className="w-10 h-10 rounded-full border-2 border-gold-400/30 hover:border-gold-400 hover:shadow-lg hover:shadow-gold-400/30 active:scale-95 transition-all flex items-center justify-center overflow-hidden flex-shrink-0"
        title={displayName}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Profile menu"
        aria-expanded={isOpen}
      >
        {user?.profileImage ? (
          <img
            src={user.profileImage}
            alt={displayName}
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gold-400 to-gold-300 text-brown-900 font-semibold text-sm rounded-full">
            {initials}
          </div>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-56 bg-brown-900/98 border border-gold-400/30 rounded-xl shadow-2xl z-1000 animate-fade-up">
          {/* User Info Header */}
          <div className="flex items-center gap-3 p-3 border-b border-gold-400/20">
            <div className="w-10 h-10 rounded-full border border-gold-400/30 overflow-hidden flex-shrink-0">
              {user?.profileImage ? (
                <img src={user.profileImage} alt={displayName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gold-400 to-gold-300 flex items-center justify-center text-brown-900 font-semibold text-xs rounded-full">
                  {initials}
                </div>
              )}
            </div>
            <div>
              <p className="m-0 text-white text-sm font-medium">{displayName}</p>
              <p className="m-0 text-gray-400 text-xs mt-1">{user?.email}</p>
            </div>
          </div>

          {/* Menu Items */}
          <div className="flex flex-col gap-1 p-2">
            <button
              className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gold-400/10 hover:text-gold-400 text-gray-300 text-sm transition-colors"
              onClick={() => handleMenuItemClick('profile')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span>My Profile</span>
            </button>

            <button
              className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gold-400/10 hover:text-gold-400 text-gray-300 text-sm transition-colors"
              onClick={() => handleMenuItemClick('listings')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
              <span>My Listings</span>
            </button>

            <button
              className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gold-400/10 hover:text-gold-400 text-gray-300 text-sm transition-colors"
              onClick={() => handleMenuItemClick('orders')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              <span>Orders</span>
            </button>

            <button
              className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gold-400/10 hover:text-gold-400 text-gray-300 text-sm transition-colors"
              onClick={() => handleMenuItemClick('wishlist')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              <span>Wishlist</span>
            </button>
          </div>

          {/* Logout Button */}
          <div className="border-t border-gold-400/20">
            <button
              className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-orange-500/10 hover:text-orange-500 text-gray-300 text-sm transition-colors m-2"
              onClick={() => handleMenuItemClick('logout')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
