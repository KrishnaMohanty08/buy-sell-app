const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

/**
 * Get the auth token from localStorage
 * @returns {string} The auth token
 */
const getAuthToken = () => {
  return localStorage.getItem('authToken') || '';
};

/**
 * Add item to cart
 * @param {string} listingId - The listing ID to add
 * @param {number} quantity - Quantity to add (default: 1)
 * @returns {Promise<Object>} Response with cartItem data
 */
export const addToCart = async (listingId, quantity = 1) => {
  try {
    const token = getAuthToken();

    if (!token) {
      throw new Error('Not authenticated. Please login first.');
    }

    const response = await fetch(`${API_BASE_URL}/api/cart/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        listingId,
        quantity,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error.message || 'Failed to add item to cart');
  }
};

/**
 * Get user's cart
 * @returns {Promise<Object>} Cart data with items and total
 */
export const getCart = async () => {
  try {
    const token = getAuthToken();

    if (!token) {
      throw new Error('Not authenticated. Please login first.');
    }

    const response = await fetch(`${API_BASE_URL}/api/cart`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch cart');
  }
};

/**
 * Remove item from cart
 * @param {string} cartItemId - The cart item ID to remove
 * @returns {Promise<Object>} Response confirming removal
 */
export const removeFromCart = async (cartItemId) => {
  try {
    const token = getAuthToken();

    if (!token) {
      throw new Error('Not authenticated. Please login first.');
    }

    const response = await fetch(`${API_BASE_URL}/api/cart/${cartItemId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error.message || 'Failed to remove item from cart');
  }
};

/**
 * Update cart item quantity
 * @param {string} cartItemId - The cart item ID to update
 * @param {number} quantity - New quantity
 * @returns {Promise<Object>} Updated cartItem data
 */
export const updateCartItemQuantity = async (cartItemId, quantity) => {
  try {
    const token = getAuthToken();

    if (!token) {
      throw new Error('Not authenticated. Please login first.');
    }

    if (quantity < 1) {
      throw new Error('Quantity must be at least 1');
    }

    const response = await fetch(`${API_BASE_URL}/api/cart/${cartItemId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ quantity }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error.message || 'Failed to update cart item');
  }
};

/**
 * Clear entire cart
 * @returns {Promise<Object>} Response confirming cart cleared
 */
export const clearCart = async () => {
  try {
    const token = getAuthToken();

    if (!token) {
      throw new Error('Not authenticated. Please login first.');
    }

    const response = await fetch(`${API_BASE_URL}/api/cart`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error.message || 'Failed to clear cart');
  }
};
