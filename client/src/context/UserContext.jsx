import { createContext, useState, useContext, useEffect } from 'react';
import { getCurrentUser, isAuthenticated } from '../api/auth';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch user on mount and when token changes
  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (isAuthenticated()) {
          try {
            const userData = await getCurrentUser();
            setUser(userData);
            setCartCount(0);
          } catch (err) {
            // If user profile fetch fails but token exists, keep user authenticated
            // Create a minimal user object to indicate authenticated state
            console.warn('Failed to fetch user profile, but token exists:', err);
            setError(err.message);
            setUser({ id: 'authenticated', authenticated: true });
            setCartCount(0);
          }
        } else {
          setUser(null);
          setCartCount(0);
        }
      } catch (err) {
        console.error('Error loading user:', err);
        setError(err.message);
        setUser(null);
        setCartCount(0);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [refreshTrigger]);

  const logout = () => {
    setUser(null);
    setError(null);
    setCartCount(0);
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  const updateCartCount = (count) => {
    setCartCount(count);
  };

  const reloadUser = () => {
    // Trigger useEffect to reload user data
    setRefreshTrigger(prev => prev + 1);
  };

  const value = {
    user,
    loading,
    error,
    cartCount,
    logout,
    updateUser,
    updateCartCount,
    reloadUser,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};
