import api from './http.js';

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
  return api.get('/listings', { params: filters });
};

/**
 * Get a single listing by ID
 * @param {string} id - Listing ID
 * @returns {Promise<Object>} Listing details with reviews
 */
export const getListingById = async (id) => {
  if (!id) {
    throw new Error("Listing ID is required");
  }
  return api.get(`/listings/${id}`);
};