import api from './http.js';

/**
 * Create a new listing
 * @param {Object} listingData - Listing details (title, description, price, images, etc.)
 * @returns {Promise<Object>} Created listing with ID
 */
export const createListing = async (listingData) => {
  return api.post('/listings', listingData);
};