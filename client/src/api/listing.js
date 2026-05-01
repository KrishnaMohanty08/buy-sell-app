const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

/**
 * Get all listings with optional filters
 * @param {Object} filters - Filter options
 * @param {string} filters.category - Category name (optional)
 * @param {string} filters.condition - Condition filter (optional)
 * @param {number} filters.minPrice - Minimum price (optional)
 * @param {number} filters.maxPrice - Maximum price (optional)
 * @param {string} filters.search - Search query (optional)
 * @param {string} filters.sortBy - Sort field: 'newest' or 'price' (default: 'newest')
 * @param {string} filters.sortOrder - 'asc' or 'desc' (default: 'desc')
 * @param {number} filters.page - Page number (default: 1)
 * @param {number} filters.limit - Items per page (default: 12)
 * @returns {Promise<Object>} Listings and pagination data
 */
export const getListings = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.condition) queryParams.append('condition', filters.condition);
    if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
    if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);
    if (filters.search) queryParams.append('search', filters.search);
    if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
    if (filters.sortOrder) queryParams.append('sortOrder', filters.sortOrder);
    if (filters.page) queryParams.append('page', filters.page);
    if (filters.limit) queryParams.append('limit', filters.limit);

    const response = await fetch(`${API_BASE_URL}/api/listings?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error.message || "Unable to fetch listings");
  }
};

/**
 * Get a single listing by ID
 * @param {string} id - Listing ID
 * @returns {Promise<Object>} Listing details with reviews
 */
export const getListingById = async (id) => {
  try {
    if (!id) {
      throw new Error("Listing ID is required");
    }

    const response = await fetch(`${API_BASE_URL}/api/listings/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Listing not found");
      }
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error.message || "Unable to fetch listing details");
  }
};