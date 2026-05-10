import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { logout as logoutUser } from '../api/auth';
import '../styles/profileStyles.css';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout: logoutContext } = useUser();

  if (!user) {
    return (
      <div className="profile-loading">
        <p>Loading...</p>
      </div>
    );
  }

  const handleLogout = () => {
    logoutUser();
    logoutContext();
    navigate('/auth');
  };

  return (
    <div className="profile-container">
      {/* Profile Header Section */}
      <div className="profile-header">
        <div className="profile-avatar-large">
          {user.profileImage ? (
            <img 
              src={user.profileImage} 
              alt={`${user.firstName} ${user.lastName}`}
              className="profile-image-large"
            />
          ) : (
            <div className="profile-initials-large">
              {`${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase()}
            </div>
          )}
        </div>
        
        <div className="profile-info">
          <h1 className="profile-name">{user.firstName} {user.lastName}</h1>
          <p className="profile-email">{user.email}</p>
        </div>
      </div>

      {/* Profile Content Grid */}
      <div className="profile-content">
        {/* My Listings Section */}
        <div className="profile-section">
          <div className="section-header">
            <h2>My Listings</h2>
            <button className="btn-secondary" onClick={() => navigate('/sell')}>
              + Add Listing
            </button>
          </div>
          
          {user.listings && user.listings.length > 0 ? (
            <div className="listings-grid">
              {user.listings.map((listing) => (
                <div key={listing.id} className="listing-card">
                  {listing.image && (
                    <img 
                      src={listing.image} 
                      alt={listing.title}
                      className="listing-image"
                    />
                  )}
                  <div className="listing-info">
                    <h3 className="listing-title">{listing.title}</h3>
                    <p className="listing-price">${listing.price}</p>
                    <p className="listing-date">
                      {new Date(listing.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No listings yet</p>
              <button className="btn-primary" onClick={() => navigate('/sell')}>
                Start Selling
              </button>
            </div>
          )}
        </div>

        {/* Saved/Favorites Section */}
        <div className="profile-section">
          <div className="section-header">
            <h2>Saved Items</h2>
          </div>
          
          {user.savedListings && user.savedListings.length > 0 ? (
            <div className="listings-grid">
              {user.savedListings.map((listing) => (
                <div key={listing.id} className="listing-card">
                  {listing.image && (
                    <img 
                      src={listing.image} 
                      alt={listing.title}
                      className="listing-image"
                    />
                  )}
                  <div className="listing-info">
                    <h3 className="listing-title">{listing.title}</h3>
                    <p className="listing-price">${listing.price}</p>
                    <p className="listing-date">
                      {new Date(listing.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No saved items yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="profile-actions">
        <button 
          className="btn-secondary"
          onClick={() => navigate('/')}
        >
          Continue Shopping
        </button>
        <button 
          className="btn-logout"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
