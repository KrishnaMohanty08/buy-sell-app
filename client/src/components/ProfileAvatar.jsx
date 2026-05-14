import { useNavigate } from 'react-router-dom';
import '../styles/globals.css';

export default function ProfileAvatar({ user, onLogout }) {
  const navigate = useNavigate();
  const initials = user && `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase();
  const displayName = user ? `${user.firstName} ${user.lastName}` : '';

  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <div className="flex items-center">
      <button 
        className="w-10 h-10 rounded-full border-2 border-gold-400/30 hover:border-gold-400 hover:shadow-lg hover:shadow-gold-400/30 active:scale-95 transition-all flex items-center justify-center overflow-hidden flex-shrink-0"
        title={displayName}
        onClick={handleProfileClick}
        aria-label="View profile"
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
    </div>
  );
}
