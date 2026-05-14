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
    <div className="profile-avatar-container">
      <button 
        className="profile-avatar-btn" 
        title={displayName}
        onClick={handleProfileClick}
        aria-label="View profile"
      >
        {user?.profileImage ? (
          <img 
            src={user.profileImage} 
            alt={displayName}
            className="profile-avatar-img"
          />
        ) : (
          <div className="profile-avatar-initials">
            {initials}
          </div>
        )}
      </button>
    </div>
  );
}
