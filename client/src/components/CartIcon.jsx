import { useNavigate } from 'react-router-dom';
import '../styles/globals.css';

export default function CartIcon({ count = 0 }) {
  const navigate = useNavigate();

  const handleCartClick = () => {
    navigate('/cart');
  };

  return (
    <button 
      className="relative p-2 hover:text-gold-400 text-gray-300 transition-colors flex-shrink-0"
      title="Cart"
      onClick={handleCartClick}
      aria-label={`Cart with ${count} items`}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M1.5 1.5h1.8l1.8 8h7.4l1.5-5H4.5" />
        <circle cx="6.5" cy="12.5" r="1" fill="currentColor" stroke="none" />
        <circle cx="11.5" cy="12.5" r="1" fill="currentColor" stroke="none" />
      </svg>
      
      {count > 0 && (
        <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-semibold bg-orange-500 text-white rounded-full" aria-label={`${count} items in cart`}>
          {count > 99 ? '99+' : count}
        </span>
      )}
    </button>
  );
}
